import styled from 'styled-components';
import { motion } from "framer-motion";
import { BOTTOM_SHEET_HEIGHT } from './bottom-sheet-option';
import BottomSheetHeader from './bottom-sheet-header';
import useBottomSheet from './bottom-sheet-event';
import { ReactNode } from 'react';

const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 105;
  top: calc(100% - 85px);
  left: 0;
  right: 0;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.6);
  height: ${BOTTOM_SHEET_HEIGHT}px;
  transform: translateY(calc(250px - 100vh));
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-top: 0.5px solid lightgray;
  transition: transform 650ms ease-out;
`;

const BottomSheetContentWrapper = styled.div`
  overflow: auto;                            
  -webkit-overflow-scrolling: touch;
`;

interface BottomSheetProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ children }) => {

  const { sheet, content, header } = useBottomSheet();

  return (
    <Wrapper ref={sheet}>
      <BottomSheetHeader ref={header} />
      <BottomSheetContentWrapper ref={content}>
        {children}
      </BottomSheetContentWrapper>
    </Wrapper>
  );
};

export default BottomSheet;
