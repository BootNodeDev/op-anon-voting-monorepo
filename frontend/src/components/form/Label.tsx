import styled from 'styled-components'

export const Label = styled.label`
  color: ${({ theme: { colors } }) => colors.textColor};
  display: block;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;
`

Label.defaultProps = {
  className: 'label',
}

export const LabelAlt = styled(Label)`
  cursor: pointer;
  font-size: 1.4rem;
  font-weight: 400;
`

LabelAlt.defaultProps = {
  className: 'label',
}
