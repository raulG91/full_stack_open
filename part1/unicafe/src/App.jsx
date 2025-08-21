import { useState } from 'react'

const Statistic = ({ feedback }) => {
  const averrage = () => {
    const total = feedback.good + feedback.neutral + feedback.bad;
    return total === 0 ? 0 : ((feedback.good * 1) + (feedback.bad * -1)) / total;
  }
  const positivePercentage = () => {
    const total = feedback.good + feedback.neutral + feedback.bad;
    return total === 0 ? 0 : (feedback.good / total) * 100;
  }
  let total = feedback.good + feedback.neutral + feedback.bad;
  if (total == 0) {
    return (
      <div>
        <h1>Statistic</h1>
        <p>No feedback given</p>
      </div>
    )
  }
  else {
    return (
      <div>
        <h1>Statistic</h1>
        <table>
          <tbody>
          <StatisticLine text="Good" value={feedback.good} />
          <StatisticLine text="Neutral" value={feedback.neutral} />
          <StatisticLine text="Bad" value={feedback.bad} />
          <StatisticLine text="Total" value={total} />
          <StatisticLine text="Averrage" value={averrage()} />
          <StatisticLine text="Positive" value={`${positivePercentage()}%`} />
          </tbody>
        </table>
      </div>
    )
  }
}
const StatisticLine = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>
const Button = ({ text, onClick }) => <button onClick={onClick}>{text}</button>

function App() {
  const [feedback, setFeedback] = useState({ good: 0, neutral: 0, bad: 0 })

  const handleGood = () => {
    setFeedback({ ...feedback, good: feedback.good + 1 })
  }
  const handleNeutral = () => {
    setFeedback({ ...feedback, neutral: feedback.neutral + 1 })
  }
  const handleBad = () => {
    setFeedback({ ...feedback, bad: feedback.bad + 1 })
  }

  return (
    <>
      <div>
        <h1>Give feedback</h1>
      </div>
      <div>
        <Button text="good" onClick={handleGood} />
        <Button text="neutral" onClick={handleNeutral} />
        <Button text="bad" onClick={handleBad} />
      </div>
      <div>
        <Statistic feedback={feedback} />
      </div>
    </>
  )
}

export default App
