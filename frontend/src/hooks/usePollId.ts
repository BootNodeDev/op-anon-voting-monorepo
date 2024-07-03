import { useCallback, useState } from 'react'

import { ONEn } from '../constants/numbers'

type Error = 'BIG_INT_CONVERSION'

type usePollIdStateType = { pollId: bigint; error: null } | { pollId: null; error: Error }
type usePollIdReturnType = usePollIdStateType & {
  handleChangePollId: (input: string) => void
}

export const usePollId = (): usePollIdReturnType => {
  const [state, setState] = useState<usePollIdStateType>({ pollId: ONEn, error: null })

  const handleChangePollId = useCallback((input: string) => {
    try {
      console.log(input, 'input')
      const newPollId = BigInt(input)
      setState({ pollId: newPollId, error: null })
    } catch (e) {
      setState({ pollId: null, error: 'BIG_INT_CONVERSION' })
    }
  }, [])

  console.log({ ...state })
  return { ...state, handleChangePollId }
}
