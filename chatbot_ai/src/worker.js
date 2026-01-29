export default {
  async fetch(request, env, ctx) {
    try {
      if (request.method === 'OPTIONS') {
        return handleCORS();
      }

      const url = new URL(request.url);
      
      if (url.pathname === '/chat' && request.method === 'POST') {
        return handleChatRequest(request, env);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};

function handleCORS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

async function handleChatRequest(request, env) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // build conversation context
    const messages = [
      { role: 'system', content: 'You are a helpful AI assistant for a mobile app chatbot. Provide concise, helpful responses.' },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // use Cloudflare AI binding
    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });

    const botResponse = response.response || "Sorry, I couldn't process your request.";

    return new Response(JSON.stringify({ 
      response: botResponse,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('Chat request error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}