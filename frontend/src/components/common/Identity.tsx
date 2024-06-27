import styled, { css } from 'styled-components'

import { Idcard } from '@/src/components/assets/Idcard'
import { Button } from '@/src/components/buttons/Button'
import { Code } from '@/src/components/text/Code'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  border-radius: 8px;
  padding: 16px;
  background-color: ${({ theme: { colors } }) => colors.lighterGray};
`
const IconWrapper = styled.div<{ isAssigned: boolean }>`
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  height: 80px;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme: { colors } }) => colors.primary};
  ${({ isAssigned }) =>
    isAssigned
      ? css`
          color: ${({ theme: { colors } }) => colors.primary};
        `
      : css`
          color: ${({ theme: { colors } }) => colors.gray};
        `}
`
const Content = styled.div`
  font-size: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
`
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: start;
  padding: 8px 0;
`
const Title = styled.div`
  font-weight: 500;
  font-size: 1.6rem;
`

interface Props {
  message?: string
  identity: string | null
  onGenerate: () => void
}

export const Identity = ({ identity, message, onGenerate, ...restProps }: Props) => {
  return (
    <>
      <Wrapper {...restProps}>
        <IconWrapper isAssigned={identity ? true : false}>
          <Idcard />
        </IconWrapper>
        <ContentWrapper>
          <Content>
            <Title>{identity ? message : 'No identity assigned'}</Title>
            {identity ? (
              <Code>{identity}</Code>
            ) : (
              <> Please generate an identity to create polls or cast your vote anonymously. </>
            )}
          </Content>
          {!identity && <Button onClick={onGenerate}> Generate identity </Button>}
        </ContentWrapper>
      </Wrapper>
    </>
  )
}
