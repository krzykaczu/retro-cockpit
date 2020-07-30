// https://blog.bitlabstudio.com/a-simple-chat-app-with-react-node-and-websocket-35d3c9835807

import React, { PureComponent } from 'react';
import { Action } from 'redux';
import { connect } from 'react-redux';

import ChatInput from './components/chat-input';
import ChatMessage from './components/chat-message';

import { classNames } from 'common/helpers';
import styles from './style.scss';

import { iRootState, Dispatch } from '../../resources/store/store';

import WebSocketService from 'common/services/websocket-service';

WebSocketService.init();

export interface Message {
    name: string;
    text: string;
}

interface ChatProps {
    name: string;
    chat: Message[];
    addMessage(message: Message): Action;
}

class Chat extends PureComponent<ChatProps> {
    private messageListRef = React.createRef<HTMLDivElement>();

    public componentDidMount() {
        WebSocketService.open();
        WebSocketService.onMessage(this.props.addMessage);
    }

    public componentDidUpdate() {
        if (this.messageListRef.current) {
            this.messageListRef.current.scrollTop = this.messageListRef.current.scrollHeight;
        }
    }

    public render() {
        return (
            <section className={styles.comms}>
                {/* <label htmlFor="name">
                    Name:&nbsp;
                    <input
                        type="text"
                        id={'name'}
                        placeholder={'Enter your name...'}
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value })}
                    />
                </label>
                 */}
                <div className={classNames('message-list', styles.message_container)} ref={this.messageListRef}>
                    {this.props.chat.map((message, index) => (
                        <ChatMessage key={index} {...message} />
                    ))}
                </div>
                {/* <ChatInput onSubmitMessage={(messageString) => this.submitMessage(messageString)} /> */}
                <ChatInput
                    onSubmitMessage={(messageString) =>
                        WebSocketService.sendMessage(messageString, this.props.name, this.props.addMessage)
                    }
                />
            </section>
        );
    }
}

const mapState = (state: iRootState) => ({
    chat: state.chat.chat,
    name: state.chat.name,
});

const mapDispatch = (dispatch: Dispatch) => {
    return {
        addMessage: (payload: Message) => {
            return dispatch.chat.addMessage(payload);
        },
    };
};

export default connect(mapState, mapDispatch)(Chat);