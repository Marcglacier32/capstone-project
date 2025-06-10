// src/components/Help.jsx
// Help section with FAQs for user support
import React from 'react';

const Help = () => {
  const faqs = [
    {
      question: 'How do I create a group?',
      answer: 'Log in, navigate to the Groups page, enter a group name and number of signatories, and click Create Group.',
    },
    {
      question: 'How can I make a deposit?',
      answer: 'On the Groups page, select a group, enter the deposit amount, and click Deposit.',
    },
    {
      question: 'What are signatories?',
      answer: 'Signatories are the number of members required to approve transactions or changes in a group.',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Help & FAQs</h2>
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700">{faq.question}</h3>
            <p className="text-sm text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help;