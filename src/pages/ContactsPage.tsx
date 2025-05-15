import React from 'react';
import ContactsList from '../components/contacts/ContactsList';

const ContactsPage: React.FC = () => {
  return (
    <div className="h-full">
      <ContactsList />
    </div>
  );
};

export default ContactsPage;