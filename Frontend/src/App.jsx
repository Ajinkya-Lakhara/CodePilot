import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Welcome to code review!\\n\";\n    return 0;\n}`)
  const [languageId, setLanguageId] = useState(54)
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [review, setReview] = useState("")
  const [selectedTab, setSelectedTab] = useState("inputOutput")

  useEffect(() => {
    prism.highlightAll()
  }, [code])

  const reviewCode = async () => {
    const response = await axios.post('http://localhost:3000/ai/get-review', { code })
    setReview(response.data)
  }

  const runCode = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/run-code', {
        languageId,
        code,
        input
      })
      setOutput(response.data.stdout || response.data.stderr || response.data.compile_output)
    } catch (error) {
      setOutput("Error executing code.")
    }
  }

  const codeLines = code.split("\n")
  const containerLineCount = 20
  const totalLines = Math.max(codeLines.length, containerLineCount)

  return (
    <main className="container">
      <div className="left">
        <div className="language-select">
          <label htmlFor="language">Language: </label>
          <select
            id="language"
            value={languageId}
            onChange={(e) => setLanguageId(Number(e.target.value))}
          >
            <option value={63}>JavaScript</option>
            <option value={62}>Java</option>
            <option value={71}>Python</option>
            <option value={54}>C++</option>
            <option value={50}>C</option>
          </select>
        </div>

        <div className="code">
          <div className="scroll-container">
            <div className="editor-wrapper">
              <div className="line-numbers">
                {new Array(totalLines).fill("").map((_, i) => (
                  <div key={i} className="line-number">{i + 1}</div>
                ))}
              </div>

              <div className="code-editor-wrapper">
                <Editor
                  value={code}
                  onValueChange={(updatedCode) => setCode(updatedCode)}
                  highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
                  padding={10}
                  className="code-editor"
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 16,
                    backgroundColor: "transparent",
                    color: "white",
                    whiteSpace: "pre",
                    lineHeight: 1.5,
                    height: "100%",
                    width: "100%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="button-row">
          <button onClick={runCode}>Run</button>
          <button onClick={reviewCode}>Review</button>
        </div>
      </div>

      <div className="right">
        <div className="tab-select">
          <button
            className={selectedTab === "inputOutput" ? "active" : ""}
            onClick={() => setSelectedTab("inputOutput")}
          >
            Input/Output
          </button>
          <button
            className={selectedTab === "review" ? "active" : ""}
            onClick={() => setSelectedTab("review")}
          >
            Code Review
          </button>
        </div>

        {selectedTab === "inputOutput" && (
          <div className="input-output">
            <div className="input-section">
              <label>Input:</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows="6"
                placeholder="Enter input here..."
              />
            </div>

            <div className="output-section">
              <label>Output:</label>
              <pre>{output}</pre>
            </div>
          </div>
        )}

        {selectedTab === "review" && (
          <div className="review-section">
            <h2>Code Review</h2>
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review}
            </Markdown>
          </div>
        )}
      </div>
    </main>
  )
}

export default App
