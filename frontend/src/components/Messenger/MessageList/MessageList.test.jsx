import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageList from './MessageList';

//Mock message data
const mockMessages = [
    {
        id: 1, 
        content: 'Speak friend and enter?',
        username: 'Gandalf',
        user_id: 1,
        created_at: '2026-01-01T10:00:00Z'
    },
    {
        id: 12, 
        content: "What's elvish for friend?",
        username: 'Frodo',
        user_id: 2,
        created_at: '2026-01-01T10:01:00Z'
    }
];

describe ('MessageList', () => {
    
    it('renders messages when passed a message array', () => {
        //Arrange
        render(<MessageList messages={mockMessages} currentUserId={1}/>);
        //Assert
        expect(screen.getByText('speak friend and enter', {exact: false})).toBeInTheDocument();
        expect(screen.getByText('elvish for friend', {exact: false})).toBeInTheDocument();
    });

    it('renders correct number of messages', () => {
        render(<MessageList messages={mockMessages} currentUserId={1}/>);

        const messages = screen.getAllByRole('article');
        expect(messages).toHaveLength(2);
    });

    it('renders an empty list when no messages are passed', () => {
        render(<MessageList messages={[]} currentUserId={1} />);

        const messages = screen.queryAllByRole('article');
        expect(messages).toHaveLength(0);
    });

    it('renders the correct username for each message', () => {
        render(<MessageList messages={mockMessages} currentUserId={1} />);

        expect(screen.getByText('Frodo')).toBeInTheDocument();
    });

    it('does not show username for own messages', () => {
        render(<MessageList messages={mockMessages} currentUserId={1} />);

        expect(screen.queryByText('Gandalf')).not.toBeInTheDocument();
    });
});