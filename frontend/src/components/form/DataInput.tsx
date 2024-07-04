import { useCallback, useState } from 'react'

import { Formfield } from '@/src/components/form/Formfield'
import { Textfield, TextfieldStatus } from '@/src/components/form/Textfield'
import { Maybe } from '@/types/utils'

type DataInputProps = {
  onChange: (input: string) => void
  value: string
  id: string
  label: string
  description?: string
  initialValue: string
  error?: Maybe<string>
  placeholder?: string
}

// TODO This does the same as `FormField` ?
export const DataInput = ({
  description,
  error,
  id,
  initialValue,
  label,
  onChange,
  placeholder,
  value,
}: DataInputProps) => {
  const [internalValue, setInternalValue] = useState(initialValue)

  const handleChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const newValue = event && event.target ? event.currentTarget.value : ''
      onChange(newValue)
      setInternalValue(newValue)
    },
    [onChange],
  )

  return (
    <>
      <Formfield
        description={description}
        formControl={
          <Textfield
            id={id}
            onChange={handleChange}
            placeholder={placeholder}
            value={internalValue}
          />
        }
        label={label}
        labelFor={label}
        status={
          error
            ? TextfieldStatus.error
            : internalValue === value
            ? TextfieldStatus.success
            : undefined
        }
        statusText={error ?? undefined}
      />
    </>
  )
}
