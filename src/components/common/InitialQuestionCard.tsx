import Image from 'next/image';

interface Props {
  content: string;
  icon_url: string;
  background: string;
  setQuestion: (question: string) => void;
}

const InitialQuestionCard = ({ content, icon_url, background, setQuestion }: Props) => (
  <button
    type="button"
    className="flex flex-col p-4 gap-2 items-start self-stretch bg-primary rounded-3xl h-[136px]"
    onClick={() => setQuestion(content)}
  >
    <Image
      className={`flex rounded-lg items-center p-2 ${background}`}
      height={32}
      width={32}
      src={icon_url}
      alt="icon"
    />
    <span className="text-text-secondary text-left font-inter font-geo-description">{content}</span>
  </button>
);

export default InitialQuestionCard;
