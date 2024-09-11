// import useMapContext from "@/map/useMapContext";
// import { useContext, useEffect, useState } from "react";
// export interface IToolsPropertyModalPayload {
//   name?: string;
//   description?: string;
//   width?: number;
//   color?: string;
//   showLabel?: boolean;
//   showName?: boolean;
//   showDescription?: boolean;
//   showLabelButton?: boolean;
//   showDeleteButton?: boolean;
// }

// export interface IToolsPropertyModalOptions {
//   showName?: boolean;
//   showDescription?: boolean;
//   showLabelButton?: boolean;
//   showDeleteButton?: boolean;
// }
// interface Props {
//   onClose: () => void;
//   onChange: (changes: IToolsPropertyModalPayload) => void;
//   onDelete?: () => Promise<void>;
//   options?: IToolsPropertyModalOptions;
//   data?: IToolsPropertyModalPayload;
// }

// const ToolsPropertyModal = ({ onClose, onChange, data, options, onDelete }: Props) => {
//   const { selectedTool } = useMapContext();
//   const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
//   const [color, setColor] = useState<string>("#FF4900");
//   const [showLabel, setShowLabel] = useState(true);
//   const handleColorPicker = () => {
//     setIsColorPickerVisible(!isColorPickerVisible)
//   }
//   const [isLoading, setIsLoading] = useState(false);

//   const { showName, showDescription, showLabelButton, showDeleteButton } = data || { showName: true, showDescription: true, showLabelButton: true, showDeleteButton: true };

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [width, setWidth] = useState(2);

//   const handleChangeData = (v: Object) => {
//     onChange?.({
//       ...data,
//       ...v,
//     });
//   }

//   const handleColorChange = (change: Color) => {
//     setColor(change.toHexString());
//     handleChangeData({ color: change.toHexString() });
//   };

//   const handleClose = () => {
//     onClose?.();
//   }

//   useEffect(() => {
//     data?.color && setColor(data.color);
//     data?.name && setName(data.name);
//     data?.description && setDescription(data.description);
//     data?.width && setWidth(data.width);
//     data?.showLabel && setShowLabel(data.showLabel);
//   }, [data?.color, data?.name, data?.description, data?.width, data?.showLabel]);

//   const handleOnTrash = async () => {
//     try {
//       setIsLoading(true);
//       await onDelete?.();
//       onClose?.();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleWidth = (w: number) => {
//     setWidth(w);
//     handleChangeData({
//       width: w,
//     })
//   }

//   return (
//     <>
//       <div
//         className={`fixed bg-white rounded-2xl w-[360px] bottom-0 bg-transparent left-1/2 -translate-x-1/2 tb:left-[unset] tb:-translate-x-0 tb:bottom-4 tb:top-[unset] flex flex-col z-[5] shadow h-fit`}
//       >
//         <div className="px-4 py-5 flex flex-col gap-4">
//           <div className="flex flex-col gap-[6px]">

//             <div className={`flex items-center gap-2 py-2 ${showName ? "justify-between" : "justify-end"}`}>
//               {showName && (
//                 <input
//                   value={name}
//                   className="flex flex-1 outline-none font-bold"
//                   type="text"
//                   placeholder="Add a name"
//                   onChange={(e) => setName(e.target.value)} />
//               )}
//               <button className="p-1" onClick={handleClose} title="Close">
//                 <Close width={20} height={20} color="#5A5E77" />
//               </button>
//             </div>

//             {showDescription && (
//               <div className="border-b border-lightGrey pb-4">
//                 <input
//                   value={description}
//                   className="flex flex-1 outline-none"
//                   type="text"
//                   placeholder="Add a description"
//                   onChange={(e) => setDescription(e.target.value)}
//                 />
//               </div>
//             )}
//           </div>
//           {data?.width && (
//             <div className="flex items-center gap-4">
//               <div className="w-[70px] text-sm">Width</div>
//               <Slider
//                 defaultValue={2}
//                 value={width}
//                 onChange={(_e, value) => handleWidth(value as number)}
//                 min={0}
//                 max={10}
//                 marks={true}
//                 step={1}
//                 valueLabelDisplay="auto"
//                 sx={{
//                   color: '#080D23',
//                   '& .MuiSlider-rail': {
//                     height: 8,
//                   },
//                   '& .MuiSlider-track': {
//                     height: 8,
//                   },
//                   '& .MuiSlider-thumb': {
//                     borderRadius: '1000px',
//                     borderWidth: 4,
//                     borderColor: "white",
//                     width: 20,
//                   },
//                 }}
//               />
//             </div>
//           )}
//           <div className="flex items-center w-full space-between">
//             <div className="w-full text-sm">Color</div>
//             <div className="flex justify-end items-center gap-[10px]" role="button" onClick={handleColorPicker}>
//               <div className="w-5 h-5 rounded-[2px]" style={{ background: color }} />
//               {isColorPickerVisible ? <ChevronUp width={16} height={16} color="#5A5E77" /> : <ChevronDown width={16} height={16} color="#5A5E77" />}
//             </div>
//           </div>

//           {showLabelButton && (
//             <div className="flex items-center w-full space-between">
//               <div className="w-full text-sm">{selectedTool === MapToolMode.POLYGON ? "Area" : selectedTool === MapToolMode.LINESTRING ? "Distance" : "Label"}</div>
//               <ThemeProvider theme={switcherTheme}>
//                 <IOSSwitch sx={{ m: 1 }}
//                   checked={showLabel}
//                   onChange={() => setShowLabel(!showLabel)}
//                   inputProps={{ 'aria-label': 'controlled' }}
//                 />
//               </ThemeProvider>
//             </div>
//           )}

//           {showDeleteButton && (
//             <div className="flex items-center w-full space-between">
//               <div className="w-full text-sm">Delete</div>
//               {isLoading ? <Spinner className="w-5 h-5" /> : <div className="w-5 h-5 bg-cover bg-trash-icon" role="button" onClick={handleOnTrash}></div>}
//             </div>
//           )}
//         </div>
//       </div>
//       <Modal isVisible={isColorPickerVisible} className="w-fit">
//         <div className="flex items-center justify-between p-3">
//           <p className="font-bold">Color</p>
//           <button onClick={handleColorPicker}>
//             <Close />
//           </button>
//         </div>
//         <ColorPicker disabledAlpha value={color} onChangeComplete={handleColorChange} />
//       </Modal>
//     </>
//   );
// };

// export default ToolsPropertyModal;
