import 'package:flutter/material.dart';
import 'screens/chatbot.dart';

void main() {
  runApp(const ChatBotApp());
}

class ChatBotApp extends StatelessWidget {
  const ChatBotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Chatbot',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF007F3F)),
        useMaterial3: true,
      ),
      home: const ChatBotWrapper(),
    );
  }
}
