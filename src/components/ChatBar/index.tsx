import tw from 'tailwind-styled-components';
import { Rubik, Urbanist } from 'next/font/google';

import useMapStore from '@/zustand/useMapStore';
import useChatStore from '@/zustand/useChatStore';
import { UserProfile } from '@/types/entityTypes';
import { useEffect, useRef, useState } from 'react';
import { streamAIMutation } from '@/hooks/useGeoAI';
import useMapContext from '@/map/useMapContext';
import { Check } from 'lucide-react';
import Stroke from '@/root/public/Stroke';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Interweave } from 'interweave';
import { generateRandomId } from '@/utils/common';
import { ReplaySubject } from 'rxjs';
import RoofConditionAnswer from './roofConditionAnswer';
import InitialQuestionCard from '../common/InitialQuestionCard';

const urban = Urbanist({
  subsets: ['latin'],
  display: 'swap',
});

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
});

const StyledSidebar = tw.div`
  flex
  flex-col
  backdrop-blur-[6.945000171661377px]
  text-white
  pt-12
  pb-8
  px-6
  w-full
  gap-3
`;

const THINKING_MESSAGE = 'Thinking...';

function Chatbar({ profile }: { profile: UserProfile | undefined }) {
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [preFinalText, setPreFinalText] = useState<string | null | undefined>();

  const [value, setValue] = useState('');
  const [isCopied, setIsCopied] = useState<boolean[]>([]);
  const [intermediateAnswer, setIntermediateAnswer] = useState<string>(THINKING_MESSAGE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const { followUp, setFollowUp, chat, setChat, initialQuestion } = useChatStore();

  const { userLocation, setGeojson } = useMapContext();

  useEffect(() => {
    if (chat.length) {
      const lastAnswer = chat[chat.length - 1].answer;
      if (lastAnswer && lastAnswer.length > 0) {
        const geoJson = chat[chat.length - 1].metadata?.geojson;
        geoJson && setGeojson(geoJson);
      }
    }
  }, [chat, setGeojson]);

  const handleInput = (event: any) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    setValue(event.target.value);
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const scrollToBotom = () => {
    parentRef?.current?.scrollTo(0, parentRef.current?.scrollHeight);
  };

  const resetQuestion = () => {
    setQuestion('');
    setIsCopied([...isCopied, false]);
    setIsLoading(false);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.disabled = false;
      textarea.style.height = 'auto';
    }

    scrollToBotom();
  };

  const submitQuestion = async () => {
    const chatId = generateRandomId(16);
    const textarea = textareaRef.current;
    setIsLoading(true);
    setFollowUp([]);
    if (textarea) textarea.disabled = true;
    const subject = new ReplaySubject<any>();
    scrollToBotom();
    const subscription = subject.subscribe({
      next: r => {
        const { event, data } = r;

        if (event === 'message') {
          if (data?.intermediate) {
            setIsLoading(true);
            setIntermediateAnswer(data.intermediate);
          } else if (data?.preFinal) {
            setIsLoading(false);
            setPreFinalText(data?.preFinal);

            setChat([
              ...chat,
              {
                chatId,
                question,
                answer: data?.preFinal,
              },
            ]);
          } else if (data.finalAnswer) {
            // setPreFinalText(undefined);
            subscription.unsubscribe();

            setFollowUp(data?.followupSuggestions || []);
            setGeojson(data?.metadata?.geojson);
            setChat([
              ...chat,
              {
                chatId,
                question,
                answer: data?.finalAnswer,
                metadata: data?.metadata,
              },
            ]);
            resetQuestion();
          }
        }
        setTimeout(scrollToBotom, 100);
      },
      error: () => {
        resetQuestion();
      },
      complete: () => {
        subscription.unsubscribe();
      },
    });

    await streamAIMutation(
      {
        stream: true,
        query: question,
        additionalContext: {
          userId: profile?.id,
          userFirstName: profile?.first_name,
          userLastName: profile?.last_name,
          userLat: userLocation?.latitude,
          userLon: userLocation?.longitude,
        },
      },
      subject,
    );
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const textarea = textareaRef.current;
    if (textarea && value.trim() !== '') {
      textarea.disabled = true;
      setValue('');
      setGeojson(null);
      setQuestion(value);
    }
  };

  const handleEnterKey = (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  function handleFollowUp(event: any) {
    setQuestion(event.target.innerText);
  }

  const copyToClipboard = (index: number, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      const newIsCopied = isCopied.map((_, i) => i === index);
      setIsCopied(newIsCopied);
      setTimeout(() => {
        setIsCopied(newIsCopied.map(() => false));
      }, 2000);
    });
  };

  useEffect(() => {
    if (question.trim() !== '') {
      submitQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  return isMapGlLoaded ? (
    <StyledSidebar className={urban.className}>
      <div className="promptContainer" ref={parentRef}>
        {chat.length === 0 && !isLoading && !preFinalText && (
          <div className="gap-6 flex flex-col">
            <div>
              <div className="text-text-primary font-manrope font-geo-large-header self-stretch">
                Hi, {profile?.first_name}
              </div>
              <div className="text-text-secondary font-inter font-geo-description">
                This is where your geospatial journey begins
              </div>
            </div>
            <div className="flex flex-col items-start self-stretch gap-2">
              {initialQuestion.map((q, index) => (
                <InitialQuestionCard
                  key={index}
                  content={q.question}
                  background={q.background}
                  icon_url={q.icon_url}
                  setQuestion={setQuestion}
                />
              ))}
            </div>
          </div>
        )}
        {chat.map((c, index) => (
          <div key={index} className="mt-4">
            <div className="text-2xl font-medium">{c.question}</div>
            {(c.answer || preFinalText) && (
              <div className="answer leading-5">
                <div className={`aiLogo inline-flex ${rubik.className}`}>
                  <Image height={24} width={24} src="/chat/ailogo.svg" alt="AI Logo" />
                  <span> Geolava</span>
                </div>
                {c.metadata?.geojson?.features?.length === 1 &&
                  (c.metadata?.geojson?.features[0].properties.roof_condition_score ||
                    c.metadata?.geojson?.features[0].properties.roof_condition) && (
                    <RoofConditionAnswer
                      roofCondition={
                        c.metadata?.geojson?.features[0].properties.roof_condition_score ||
                        c.metadata?.geojson?.features[0].properties.roof_condition
                      }
                      wkt={c.metadata?.geojson?.features[0].properties.parcel_wkt}
                    />
                  )}
                <div className="aiAnswer textAnswer">
                  <Interweave content={c.answer || preFinalText || ''} />
                </div>

                <div className="copyContainer">
                  {isCopied[index] ? (
                    <Check color="#00AE5A" />
                  ) : (
                    <Image
                      height={32}
                      width={32}
                      alt="copy"
                      src="/chat/copy.svg"
                      title="Copy"
                      role="button"
                      onClick={() => {
                        copyToClipboard(index, c?.answer || '');
                      }}
                    />
                  )}
                </div>
                <div className="hr-divider">
                  <Stroke />
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading ? (
          <div className="mt-4">
            <div className="text-2xl font-medium">{question}</div>
            <div className="thinking-content font-geo-regular mt-4">
              {intermediateAnswer}
              <Skeleton baseColor="#9D85FF" highlightColor="#3F3956" height="12px" count={3} />
            </div>
          </div>
        ) : null}
        {followUp?.length ? (
          <>
            <div className={`aiLogo mt-4 inline-flex gap-2 ${rubik.className}`}>
              <Image height={24} width={24} src="/chat/ailogo.svg" alt="AI Logo" />
              <span>Related</span>
            </div>
            <div className="followupContainer">
              {followUp.map((f, index) => (
                <div
                  key={index}
                  className="followup"
                  onClick={handleFollowUp}
                  onKeyDown={handleFollowUp}
                  aria-hidden="true"
                >
                  <div>{f}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          ''
        )}
      </div>
      <div className="promptInput bg-primary">
        <textarea
          ref={textareaRef}
          rows={1}
          id="question"
          placeholder="Ask anything about a location..."
          dir="auto"
          tabIndex={0}
          onChange={handleInput}
          onKeyDown={handleEnterKey}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isFocused ? (
          <Image
            height={32}
            width={32}
            src="/chat/search-logo.svg"
            alt="Search-logo"
            className="l"
          />
        ) : (
          <Image
            height={32}
            width={32}
            className={`l ${isLoading ? 'opacity-50' : ''}`}
            src="/chat/search.svg"
            alt="Search"
          />
        )}
      </div>
    </StyledSidebar>
  ) : null;
}

export default Chatbar;
