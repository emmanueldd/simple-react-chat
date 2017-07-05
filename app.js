// app.js
import React, { Component } from 'react'
import { render } from 'react-dom'
import Cosmic from 'cosmicjs'
import io from 'socket.io-client'
import config from './config'
import uuid from 'node-uuid'
import S from 'shorti'
import _ from 'lodash'
import { Input } from 'react-bootstrap'
class App extends Component {
  constructor() {
    super()
    this.state = {
      data: {
        messages: []
      }
    }
  }
  componentDidMount() {
    let data = this.state.data
    const socket = io()
    Cosmic.getObjects(config, (err, res) => {
      const messages = res.objects.type.messages
      if (messages) {
        messages.reverse()
        this.setState({
          data: {
            messages
          }
        })
      }
    })
    // Listen for messages coming in
    socket.on('chat message', message => {
      data = this.state.data
      const messages = this.state.data.messages
        messages.push(message)
        this.setState({
          data: {
            messages
          }
        })
      // }
    })
  }
  componentDidUpdate() {
    if (this.refs.message)
      this.refs.message.refs.input.focus()
    if (this.refs.messages_list_box)
      this.refs.messages_list_box.scrollTop = this.refs.messages_list_box.scrollHeight
  }
  sendMessage() {
    const data = this.state.data
    const messages = data.messages
    const socket = io()
    const message_text = this.refs.message.refs.input.value.trim()
    if (!message_text)
      return
    const message_emit = {
      message: message_text,
      private: this.refs.private.checked.toString()
    }
    // Send the message via socket io
    socket.emit('chat message', message_emit)
    this.setState({
      data: {
        messages
      }
    })
    this.refs.message.refs.input.value = ''
    this.refs.private.checked = false
  }
  handleSubmit(e) {
    e.preventDefault()
    const data = this.state.data
    this.sendMessage()
  }
  render() {
    const data = this.state.data
    let form_input
    form_input = (
      <div>
        <label htmlFor="private">Message privé </label>
        <input
          type="checkbox"
          ref="private"
          id="private"
        />
        <br />
        <label htmlFor="message">Votre message: </label>
        <Input type="text" ref="message" id="message" />
      </div>
    )
    const messages = data.messages
    let messages_list
    if (messages) {
      // order by created
      const sorted_messages = _.sortBy(messages, message => {
        return message.created
      })
      messages_list = sorted_messages.map(message_object => {
        if (message_object) {
          const is_private = message_object.metafield.private.value == 'true'
          return (
            <li style={ { listStyle: 'none', ...S('mb-5') } } key={ message_object._id }>
              { is_private ?
                (<span style={ { backgroundColor: "#FF0000" } }>(Private)</span>) :
                ('')
              }
              { message_object.metafield.message.value }
            </li>
          )
        }
      })
    }
    const list_box_style = {
      ...S('h-' + (window.innerHeight - 140)),
      overflowY: 'scroll'
    }
    return (
      <div>
        <div style={ S('pl-15') }>
          <div ref="messages_list_box" style={ list_box_style }>
            <ul style={ S('p-0') }>{ messages_list }</ul>
          </div>
        </div>
        <div style={ S('absolute b-0 w-100p pl-15 pr-15') }>
          <form onSubmit={ this.handleSubmit.bind(this) }>
            { form_input }
          </form>
        </div>
      </div>
    )
  }
}
const app = document.getElementById('app')
render(<App />, app)
