import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Sidebar from './components/Sidebar/Sidebar'
import Feed from './components/Feed/Feed1'
import Widgets from './components/Widgets/Widgets'
import SidebarChat from './components/SidebarChat/SidebarChat'
import Chat from './components/Chat/Chat'
import ConversationInfo from './components/ConversationInfo/ConversationInfo'
import Login from './components/Login/Login1'
import Profile from './components/Profile/Profile1'
import ProfileWidgets from './components/ProfileWidgets/ProfileWidgets'
import ProfileFollow  from './components/ProfileFollow/ProfileFollow'
import Status from './components/Status/Status1'
import CommentThread from './components/CommentThread/CommentThread1'
import StatusWidget from './components/StatusWidget/StatusWidget'

import BottomNav from './elements/BottomNav/BottomNav'

import './App.css'

import ChatContextProvider from './contexts/ChatContextProvider'
import {useStateValue} from './contexts/StateContextProvider'
import {actionTypes} from './contexts/StateReducers'

const App = () => {
  const [{user}, dispatch] = useStateValue()

  useEffect(() => {
      dispatch({
        type: actionTypes.SET_USER,
        user: JSON.parse(localStorage.getItem('twittie_user'))
      })    
  }, [])
  
  
  
  return (
    <div className="app">
    {
      user?
      <Router>  
        <div className="app__mainContent">
          <Sidebar />
          <Switch>
            <Route exact path='/'>
                <div className="app__main">
                  <Feed />
                  <Widgets />
                </div>         
            </Route>

            <Route path='/messages'>
              <ChatContextProvider>
                <div className="app__main">
                  <SidebarChat />
                  <Switch>
                    <Route path='/messages/:roomId' exact>
                      <Chat />
                    </Route>
                    <Route path='/messages/:roomId/info'>
                      <ConversationInfo />
                    </Route>
                  </Switch>
                </div>            
              </ChatContextProvider>           
            </Route>       

            <Route path='/profile/:username' >
                <div className="app__main">
                  <Switch>
                    <Route path='/profile/:username' exact component={Profile} />
                    <Route path='/profile/:username/followinfo' render={()=> <ProfileFollow />} />
                  </Switch>
                  <ProfileWidgets />
                </div>         
            </Route>

            <Route path='/status/:postId'>
                <div className="app__main">
                  <Switch>
                    <Route path='/status/:postId' exact>
                        <Status />
                    </Route> 
                    <Route path='/status/:postId/:commentId'>
                        <CommentThread />
                    </Route>
                  </Switch>
                  <StatusWidget />
                </div> 
            </Route>

          </Switch>
        </div>
        <BottomNav />
      </Router>
      :
      <Login />
    }
    </div>   
  )
}

export default App
