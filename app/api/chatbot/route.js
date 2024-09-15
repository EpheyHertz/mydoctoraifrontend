// api/chatbot/route.js
// import { NextResponse } from 'next/server';
// import axios from 'axios';

// export async function POST(request) {
//   try {
//     const { message } = await request.json();
//     const token = request.headers.get('Authorization')?.replace('Bearer ', ''); // Extract token from headers

//     // Axios request to the backend
//     const response = await axios.post('http://127.0.0.1:8000/apis/chatbotdiagnosis/', 
//       { message },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': Bearer ${token}, // Include 'Bearer ' if using JWT
         
//         },
//       }
//     );

//     // Extract the data from the response
//     const result = response.data;

//     return NextResponse.json(result);
//   } catch (error) {
//     console.error('Error fetching chatbot response:', error);
//     return NextResponse.json({ error: 'Failed to fetch chatbot response.' }, { status: 500 });
//   }
// }




import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    // Extract message and chat_id from the request body
    const { message, chat_id } = await request.json();

    // Extract the token from the Authorization header
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    // If chat_id is not provided, indicate that a new chat should be started
    // if (!chat_id) {
    //   return NextResponse.json(
    //     { error: 'chat_id is required.' }, 
    //     { status: 400 } // Bad Request
    //   );
    // }

    // Perform an Axios request to the backend
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/apis/chatbotdiagnosis/', 
        { message, chat_id }, // Send message and chat_id to the backend
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : undefined, // Include token if present
          },
        }
      );

      // Extract and return the result as JSON
      const result = response.data;
      

      // Check if the chat_id is newly created or if the chat was not found
      if (result.chat_id) {
        // Save the new chat_id in local storage for future use
       
        return NextResponse.json({
          message: result.response,
          chat_id: result.chat_id,
        });
      }

      return NextResponse.json(result);
    } catch (error) {
      // Handle errors from the backend API
      console.error('Error fetching chatbot response:', error);

      // Return error response if something goes wrong with the API request
      return NextResponse.json(
        { error: 'Failed to fetch chatbot response.' }, 
        { status: 500 } // Internal Server Error
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);

    // Return a generic error response if something goes wrong with the request processing
    return NextResponse.json(
      { error: 'Failed to process the request.' }, 
      { status: 500 } // Internal Server Error
    );
  }
}
export async function GET(request) {
  try {
    // Extract the token from the Authorization header
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    // If token is missing, return an error response
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is required.' }, 
        { status: 401 } // Unauthorized
      );
    }

    // Perform an Axios GET request to the backend to fetch all chats
    try {
      const response = await axios.get('http://127.0.0.1:8000/apis/user/chats/', {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the headers
        },
      });

      // If the response status is 200 but no data, handle empty chats case
      const chatHistory = response.data;

      if (!chatHistory.length) {
        return NextResponse.json(
          { message: 'No chats available for the user.' }, 
          { status: 200 } // OK but no data
        );
      }

      // Return the chat history as JSON
      return NextResponse.json(chatHistory);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle 404 error when no chats are found
        return NextResponse.json(
          { message: 'No chats found for the user.' },
          { status: 404 } // Not Found
        );
      }

      // Handle other errors from the backend API
      console.error('Error fetching chat history:', error);

      // Return error response if something goes wrong with the API request
      return NextResponse.json(
        { error: 'Failed to fetch chat history.' }, 
        { status: 500 } // Internal Server Error
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);

    // Return a generic error response if something goes wrong with the request processing
    return NextResponse.json(
      { error: 'Failed to process the request.' }, 
      { status: 500 } // Internal Server Error
    );
  }
}