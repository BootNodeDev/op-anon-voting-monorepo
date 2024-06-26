import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg``

export const Copy: React.FC<HTMLAttributes<SVGElement>> = ({ className, ...restProps }) => (
  <Wrapper
    className={`copy ${className}`}
    fill="none"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path d="M13.5 1.75H5.5C5.30109 1.75 5.11032 1.82902 4.96967 1.96967C4.82902 2.11032 4.75 2.30109 4.75 2.5V4.75H2.5C2.30109 4.75 2.11032 4.82902 1.96967 4.96967C1.82902 5.11032 1.75 5.30109 1.75 5.5V13.5C1.75 13.6989 1.82902 13.8897 1.96967 14.0303C2.11032 14.171 2.30109 14.25 2.5 14.25H10.5C10.6989 14.25 10.8897 14.171 11.0303 14.0303C11.171 13.8897 11.25 13.6989 11.25 13.5V11.25H13.5C13.6989 11.25 13.8897 11.171 14.0303 11.0303C14.171 10.8897 14.25 10.6989 14.25 10.5V2.5C14.25 2.30109 14.171 2.11032 14.0303 1.96967C13.8897 1.82902 13.6989 1.75 13.5 1.75ZM9.75 12.75H3.25V6.25H9.75V12.75ZM12.75 9.75H11.25V5.5C11.25 5.30109 11.171 5.11032 11.0303 4.96967C10.8897 4.82902 10.6989 4.75 10.5 4.75H6.25V3.25H12.75V9.75Z" fill="currentColor"/>
  </Wrapper>
)
