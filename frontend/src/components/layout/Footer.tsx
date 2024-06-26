import styled from 'styled-components'

import { Bn } from '@/src/components/assets/Bn'
import { InnerContainer as BaseInnerContainer } from '@/src/components/helpers/InnerContainer'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { useCookiesWarningContext } from '@/src/providers/cookiesWarningProvider'

const Wrapper = styled.footer`
  color: ${({ theme }) => theme.colors.textColor};
  flex-shrink: 0;
  margin-top: auto;
  padding-bottom: 20px;
  padding-top: 40px;
  width: 100%;
`

const InnerContainer = styled(BaseInnerContainer)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`

const Paragraph = styled(BaseParagraph)`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.2rem;
  line-height: 1.5;
  margin: 0;
  order: 2;
  text-align: center;
  display: flex;
  justify-content: center;
  column-gap: 10px;
`

const Item = styled.span`
  color: ${({ theme }) => theme.colors.textColor};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`
const BuiltByLink = styled.a`
  display: flex;
  align-items: flex-start;
  font-size: 1.2rem;
  column-gap: 8px;
  color: ${({ theme }) => theme.colors.textColor};
  text-decoration: none;
  &:hover,
  &:active,
  &:focus-visible {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const Footer: React.FC = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const year = new Date().getFullYear()
  const { cookiesWarningEnabled, showCookiesWarning } = useCookiesWarningContext()

  return (
    <Wrapper {...props}>
      <InnerContainer>
        <Paragraph>
          © {year}{' '}
          <a href="https://bootnode.dev" rel="noopener noreferrer" target="_blank">
            bootnode.dev
          </a>
          {cookiesWarningEnabled && (
            <>
              <span>-</span> <Item onClick={showCookiesWarning}>Cookies</Item>
            </>
          )}
        </Paragraph>
        <Paragraph>
          <BuiltByLink href="https://www.bootnode.dev/" rel="noopener noreferrer" target="_blank">
            Built by <Bn />
          </BuiltByLink>
        </Paragraph>
      </InnerContainer>
    </Wrapper>
  )
}
