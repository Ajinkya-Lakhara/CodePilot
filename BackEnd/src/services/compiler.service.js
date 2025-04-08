const axios = require('axios');

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
const RAPID_API_KEY = process.env.RAPID_API_KEY; // You'll add this in your .env

const headers = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': RAPID_API_KEY,
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
};

async function runCode(languageId, code, input) {
    const submission = {
        language_id: languageId,
        source_code: code,
        stdin: input
    };

    try {
        const { data } = await axios.post(`${JUDGE0_API_URL}?base64_encoded=false&wait=true`, submission, { headers });
        return {
            stdout: data.stdout,
            stderr: data.stderr,
            compile_output: data.compile_output,
            status: data.status
        };
    } catch (error) {
        console.error('Error while executing code:', error);
        throw error;
    }
}

module.exports = runCode;
