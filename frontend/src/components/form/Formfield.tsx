import { cloneElement, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { FormStatus as BaseFormStatus } from '@/src/components/form/FormStatus'
import { Label } from '@/src/components/form/Label'
import { TextfieldStatus } from '@/src/components/form/Textfield'

const Wrapper = styled.div<{ status?: TextfieldStatus | undefined }>`
  display: flex;
  flex-direction: column;
  min-width: 0;
  row-gap: 8px;
  position: relative;

  ${({ status }) =>
    status &&
    css`
      color: ${({ theme: { colors } }) => colors.error};
      border-bottom-color: ${({ theme: { colors } }) => colors.error};

      &::placeholder {
        color: ${({ theme: { colors } }) => colors.error};
      }
    `}
`

const Description = styled.p`
  max-width: 500px;
  margin: 0;
  font-size: 1.4rem;
  opacity: 0.8;
`

const FormStatus = styled(BaseFormStatus)`
  left: 3px;
  position: absolute;
  top: calc(100% + 4px);
`

export const Formfield: React.FC<{
  description?: string
  formControl: React.ReactElement
  label?: string
  labelFor?: string
  status?: TextfieldStatus | undefined
  statusText?: string | undefined
}> = ({ description, formControl, label, labelFor, status, statusText, ...restProps }) => {
  const control = useMemo(
    () =>
      cloneElement(formControl, {
        status: status,
      }),
    [status, formControl],
  )

  return (
    <Wrapper status={status} {...restProps}>
      {label && <Label htmlFor={labelFor}>{label}</Label>}
      {control}
      {statusText && <FormStatus status={status}>{statusText}</FormStatus>}
      {description && <Description>{description}</Description>}
    </Wrapper>
  )
}
