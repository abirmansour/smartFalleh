import 'package:flutter/material.dart';
import 'chat_screen.dart';

class ChatBotWrapper extends StatefulWidget {
  const ChatBotWrapper({super.key});

  @override
  State<ChatBotWrapper> createState() => _ChatBotWrapperState();
}

class _ChatBotWrapperState extends State<ChatBotWrapper> {
  bool _isChatOpen = false;

  void _toggleChat() {
    setState(() {
      _isChatOpen = !_isChatOpen;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // main app content
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Theme.of(context).colorScheme.primary.withOpacity(0.1),
                  Theme.of(context).colorScheme.secondary.withOpacity(0.1),
                ],
              ),
            ),
            child: const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.chat, size: 80, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'Welcome to AI Chatbot',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Click the robot icon to start chatting',
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                ],
              ),
            ),
          ),

          // Chat screen (overlay)
          if (_isChatOpen)
            Positioned.fill(
              child: Container(
                color: Colors.black54,
                child: ChatScreen(onClose: _toggleChat),
              ),
            ),

          // floating robot button
          Positioned(
            bottom: 24,
            right: 24,
            child: FloatingActionButton(
              onPressed: _toggleChat,
              backgroundColor: Theme.of(context).colorScheme.primary,
              child: const Icon(Icons.smart_toy, size: 28, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
