import styled from 'styled-components'

const Wrapper = styled.aside`
  padding: ${({ theme: { card } }) => card.paddingVertical}
    calc(${({ theme: { card } }) => card.paddingHorizontal} / 2);
  border-top: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    padding: 16px;
    border-top: none;
    border-left: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  }
  ol {
    margin: 8px 0 16px;
    padding: 0 0 0 0px;
    li {
      list-style-position: inside;
      font-size: 1.3rem;
      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }
  }
`

const Title = styled.div`
  font-weight: 600;
`

export const Sidebar: React.FC = ({ ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <div>
        <Title>Create </Title>
        <ol>
          <li>Provide a unique Poll ID</li>
          <li>Set a coordinator to govern the lifecycle of the poll</li>
          <li>Click on Create Poll</li>
          <li>Click on Generate Identity</li>
          <li>Set a desired Schema, and click on Set Schema</li>
          <li>Set a valid Attester, and click on Set Attester</li>
          <li>
            Now the Poll is open to enrollment. Users have to enroll at this stage to be able to
            vote.
          </li>
        </ol>
      </div>
      <div>
        <Title>Enroll to vote</Title>
        <ol>
          <li>Search for a Poll using its unique ID</li>
          <li>Click on Generate Identity</li>
          <li>If your address is attested under the correct Schema, you can enroll to vote.</li>
          <li>Click on Enroll to vote</li>
        </ol>
      </div>
      <div>
        <Title> Start the poll</Title>
        <ol>
          <li>Coordinator can click on Start Poll to enable voting for the enrolled users</li>
        </ol>
      </div>
      <div>
        <Title>Vote</Title>
        <ol>
          <li>Search for a Poll using its unique ID</li>
          <li>Enrolled users can only vote after the poll started</li>
          <li>Generate identity</li>
          <li>Select your vote and click on Cast Vote</li>
        </ol>
      </div>
      <div>
        <Title>End the poll</Title>
        <ol>
          <li>Once the voting is completed, the coordinator can End the Poll</li>
        </ol>
      </div>
    </Wrapper>
  )
}
