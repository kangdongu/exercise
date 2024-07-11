import styled from 'styled-components';
import { forwardRef } from 'react';

const Wrapper = styled.div`
  height: 24px;
  border-top-left-radius: 12px;
  border-bottom-right-radius: 12px;
  position: relative; 
  padding-top: 12px;
  padding-bottom: 4px;
`;

const Header = styled.div`
  width: 50px;
  height: 4px;
  border-radius: 2px;
  background-color: #000000;
  margin: auto;
  border-top: 1px solid gray;
`;

const BottomSheetHeader = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <Wrapper ref={ref} {...props}>
      <Header />
    </Wrapper>
  );
});

export default BottomSheetHeader;
