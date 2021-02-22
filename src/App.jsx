import React from "react";
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./App.css";
import MonacoEditor from 'react-monaco-editor';
import { Chat } from '@progress/kendo-react-conversational-ui';
import axios from 'axios'

// action creator
function updateText(text) {
  return {
    type: "UPDATE",
    text
  };
}

function updateTabIndex(text) {
  return {
    type: "UPDATE_TAB",
    text
  };
}

function updateM(text) {
  return {
    type: "UPDATE_M",
    text
  };
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.user = {
      id: 1,
      avatarUrl: "https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg"
  };
  this.bot = { id: 0,
    avatarUrl: "https://png.pngtree.com/png-vector/20190321/ourmid/pngtree-vector-users-icon-png-image_856952.jpg"

   };
    this.state = {
      tabs: [{indexCurrent:0,text:"(function name (param) {return param;})('Hiiii')"}],
      code: '',
      tabIndex:0,
      messages: [
        {
            author: this.props.bot,
            
            timestamp: new Date(),
            text: "Hello, this is a demo bot. I don't do much, but I can count symbols!"
        }
    ]
    }
  }
  
  componentDidMount () {
    this.setState({messages:this.props.messages})
    let updated = this.props.text
    updated[0].text = "(function name(param){\nreturn param;\n})('"+this.props.messages[this.props.messages.length-1].text+"')"
    this.onUpdateText(updated)
    }
    addNewMessage = (event) => {
      let botResponce = Object.assign({}, event.message);
      botResponce.text = ".  .  ."
      botResponce.author = this.props.bot;
      this.setState((prevState) => ({
          messages: [
              ...prevState.messages,
              {...event.message,text:event.message.text}
          ]
      }));
      // axios
      this.setState(prevState => ({
        messages: [
            ...prevState.messages,
            botResponce
        ]
    }));
      axios.post("https://shrouded-oasis-94153.herokuapp.com/",{code:"(function name (param) {return param;})('"+event.message.text+"')"}).then(res=>{
        if(res.data){
          this.setState(prevState => {
            prevState.messages[prevState.messages.length-1].text = res.data 
            return {
              messages:prevState.messages
          }},()=>{
            this.setState({messages:this.state.messages.filter(v=>v.text!==".  .  .")})
            this.onUpdateMessages(this.state.messages.filter(v=>v.text!==".  .  ."))
            let updated = this.props.text
            updated[0].text = "(function name(param){\nreturn param;\n})('"+event.message.text+"')"
            this.onUpdateText(updated)
          });
        }
      })
  };

  onUpdateText = data => {
    this.props.dispatch(updateText(data));
  };
  onUpdateTab = data => {
    this.props.dispatch(updateTabIndex(data));
  };
  
  onUpdateMessages = data => {
    this.props.dispatch(updateM(data));
  };

  editorDidMount(editor, monaco) {
    console.log('editorDidMount', editor);
    editor.focus();
  }
  onChange(newValue, e) {
    console.log('onChange', newValue, e);
  }

  render() {
    const options = {
      selectOnLineNumbers: true
    };
    return (
      <section className="code-and-chat_container">
        <div className="code_container">
          <Tabs style={{height:"100%"}} selectedIndex={this.props.tabIndex?this.props.tabIndex:0} onSelect={index => this.onUpdateTab(index)}>
            <div className="code-tabs_container">
              <TabList className="all-tabs-style" style={{ width: "fit-content",maxWidth:"calc(100% - 100px)", display: "flex", overflowX: "scroll", overflowY: "hidden", border: "none", flexWrap: "no-wrap" }}>
                {
                  this.props.text.map((tab, i) => {
                    return (
                      <Tab style={{ background: "none", whiteSpace: "nowrap", color: "#89948b", minWidth:"100px",paddingLeft:"5px",paddingRight:"5px",border: "1px solid #aaa", borderRadius: "5px 5px 0 0", fontSize: ".68em" }}><div style={{display:"flex"}}>Title {tab.indexCurrent + 1}
                      {i!==0?<span style={{marginLeft:"auto"}} className="fa fa-close" onClick={e=>{
                        let tabs = this.props.text
                        let tabIndex = this.props.tabIndex
                        tabs.splice(i,1)
                        let newTabIndex = ((i===tabIndex)?(tabIndex-1):tabIndex)
                        this.onUpdateTab(newTabIndex)
                        this.onUpdateText(tabs)
                      }
                      }
                        ></span>:null}
                        </div></Tab>
                    )
                  })
                }
              </TabList>
              <div className="plus-icon"
      onClick={
                  () => {
                    this.onUpdateTab(this.props.text.length)
                    this.onUpdateText([...this.props.text, {indexCurrent:this.props.text.length,text:""}])
                  }
                }
              >+</div>
              {}
            </div>
            {
              this.props.text.map((tab, i) => {
                return (
                  <TabPanel style={{height:"calc(100% - 45px)"}}>
                    <MonacoEditor
                      width="100%"
                      height="100%"
                      language="javascript"
                      theme="vs-dark"
                      value={tab.text}
                      options={{...options,readOnly:(i===0)}}
                      readOnly={i===0}
                      onChange={e=>{
                        let text = e
                        let tabs = this.props.text
                        tabs[i]={...tabs[i],text}
                        if(tab.indexCurrent!==0){
                          this.onUpdateText(tabs)
                        }
                      }}
                      editorDidMount={this.editorDidMount}
                    />
                  </TabPanel>
                )
              })
            }
          </Tabs>
        </div>
        <div className="chatbox_container">
          <Chat user={this.props.user}
                    messages={this.state.messages.map(v=>({...v,timestamp:(new Date(v.timestamp))}))}
                    onMessageSend={this.addNewMessage}
                    placeholder={"Type a message..."}
                    width={400}>
                </Chat>
        </div>
      </section>

    );
  }
}

const mapStateToProps = state => ({
  text: state.form.text,
  user: state.form.user,
  bot: state.form.bot,
  messages: state.form.messages,
  tabIndex: state.form.tabIndex,
});

export default connect(mapStateToProps)(App);


