import styled from 'styled-components'

const Wrapper = styled.aside`
  padding: ${({ theme: { card } }) => card.paddingVertical}
    calc(${({ theme: { card } }) => card.paddingHorizontal} / 2);
  border-top: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  display: flex;
  flex-direction: column;
  gap: 8px;
  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    padding: 16px;
    border-top: none;
    border-left: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  }
  a {
    font-size: 1.3rem;
    &:hover,
    &:focus-visible {
      color: ${({ theme: { colors } }) => colors.primary};
    }
  }
  ol {
    margin: 8px 0 0px;
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
      <a
        href="https://github.com/BootNodeDev/op-anon-voting-monorepo?tab=readme-ov-file#how-to-issue-an-attestation-to-an-address"
        rel="noopener noreferrer"
        target="_blank"
      >
        How to issue an attestation?
      </a>
      <div>
        <Title>Create </Title>
        <ol>
          <li>Provide a unique Poll ID</li>
          <li>Set a coordinator to govern the lifecycle of the poll</li>
          <li>Set the round of the poll</li>
          <li>Set a title for the poll</li>
          <li>Click on Create Poll</li>
          <li>Click on Generate Identity</li>
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
