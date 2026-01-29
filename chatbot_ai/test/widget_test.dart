import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:chatbot_ai/main.dart';
import 'package:chatbot_ai/screens/chat_screen.dart';

void main() {
  testWidgets('ChatBot app smoke test', (WidgetTester tester) async {
    // build app and trigger a frame.
    await tester.pumpWidget(const ChatBotApp());

    // verify that the chat interface loads
    expect(find.byType(ChatScreen), findsOneWidget);
    expect(find.byType(TextField), findsOneWidget);
    expect(find.byType(IconButton), findsOneWidget);
  });
}
