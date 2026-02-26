const messageElement = document.getElementById('message');
const refreshBtn = document.getElementById('refresh-btn');

async function fetchMessage() {
    messageElement.textContent = 'Loading...';
    try {
        const response = await fetch('http://localhost:8080/api/hello');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        messageElement.textContent = data;
    } catch (error) {
        console.error('Error fetching message:', error);
        messageElement.textContent = 'Failed to fetch message ❌';
    }
}

refreshBtn.addEventListener('click', fetchMessage);

// Initial fetch
fetchMessage();
