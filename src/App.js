import './App.css';
import axios from 'axios';
import React, { useState } from 'react'
import imgLoading from './assets/loading.svg'
import logo from './assets/logo-keyrus.svg'

function App() {
  const [tenant, settenant] = useState();
  const [webIntregration, setwebIntregration] = useState();
  const [appId, setappId] = useState();
  const [apiKey, setapiKey] = useState();
  const [userInfo, setuserInfo] = useState();
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState('');
  const [spaceIdChangeType, setspaceIdChangeType] = useState();
  const [spaceIdClear, setspaceIdClear] = useState();
  const [spaceType, setspaceType] = useState();

  const api = axios.create({
    baseURL: tenant, 
    headers: {
      'authorization': 'Bearer ' + apiKey,
      'qlik-web-integration-id': webIntregration,
      'content-type': 'application/json',
    },
  });

  async function changeSpaceType() {
    console.log(spaceType);
    if(!spaceType || spaceType === 'type' || !spaceIdChangeType){
      setmessage('Select the type space!')
    }else{
      setmessage('');
      setloading(true)
      try {
        const res = await api.put('/api/v1/spaces/' + spaceIdChangeType , {'SpaceType': spaceType});
        console.log(res)
        if(res.status === 200)
          setmessage('Space chenged successfully!')
        else
          setmessage('Error!')
      } catch (error) {
          setmessage(error.message);
      } finally {
        setloading(false);
      }
      
    } 
  }

  async function clearSpace() {
    if(!spaceIdClear){
      setmessage('Check spaceId!')
    }else{
      setmessage('');
      setloading(true)
      try {
        const res = await api.get('/api/v1/items?sort=-recentlyUsed&limit=12&spaceId=' + spaceIdClear + '&resourceSubType=directQuery,qix-df,qvd,connection_based_dataset,chart-monitoring,&resourceType=app,qvapp,qlikview,genericlink,sharingservicetask,dataset,note,automation,automl-experiment,automl-deployment&noActions=true');
        console.log(res);
        if(res.status === 200)
          setmessage('Space chenged successfully!')
        else
          setmessage('Error!')
      } catch (error) {
          setmessage(error.message);
      } finally {
        setloading(false);
      }
    } 
  }

  async function autenticate() {
    if (tenant && webIntregration && apiKey) {
      setmessage('');
      setloading(true)
      try {
        const res = await api.get('/api/v1/users/me');
        setuserInfo(res.data);
      } catch (error) {
        setmessage(error.message);
      } finally {
        setloading(false);
      }
    }else{
      setmessage('Check the fields!');
    }
  }

  async function changeSpace(){
    if (tenant && webIntregration && apiKey && appId) {
      setmessage('');
      setloading(true)
      try {
        const res = await api.put('/api/v1/apps/' + appId + '/space', {'spaceId': ''});
        if(res.status === 200)
          setmessage('App moved successfully!')
        else
          setmessage('Error!')
      } catch (error) {
          setmessage(error.message);
      } finally {
        setloading(false);
      }
    }else{
      setmessage('Check the fields!');
    }
  }

  return (
    <div className="App">
      <div className='content'>
        {loading ? (<div className='loading'>
          <img src={imgLoading} alt='loading' />
        </div>) : <></>}
            <a className='logo' href='https://keyrus.com/br/pt/home' target='_blank' rel="noreferrer">
              <img src={logo} alt='logo-keyrus' width={150} />
            </a>
            < br/>
            <span>Application used in migration projects qlik on-premises to qlik cloud. v2.0</span>
            < br/>
            <a href='https://github.com/gabriew/change-space-qlik-saas' target='_blank' rel="noreferrer">
            Application code
            </a>
            <br />
            <b>Your tenant</b>
            <input id='tenant' type='text' placeholder='https://yourtenant.us.qlikcloud.com' onChange={(e) => settenant(e.target.value)} />
            <b>Your web integration id</b>
            <a href='https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/mc-adminster-web-integrations.htm' target='_blank' rel="noreferrer">
            tutorial here
            </a>
            <input id='webIntegrationID' type='text' placeholder='1a-Abcd7845DG21g55dad9832F51j561H' onChange={(e) => setwebIntregration(e.target.value)} />
            <b>Your API Key</b>
            <a href='https://qlik.dev/tutorials/generate-your-first-api-key' target='_blank' rel="noreferrer">
            tutorial here
            </a>
            <input id='apiKey' type='text' placeholder='abcDEFgH4iJkLMNopq123456rStUvWxYz789' onChange={(e) => setapiKey(e.target.value)} />
            <input id='submit' className='button' type='button' value='conect tenant' onClick={() => autenticate()} />
            <br />
            <span>First conect in your tenant</span>
            <b className='user'>{userInfo ? 'Welcome '+ userInfo.name : ''}</b>
            <b>Your appId (used to set personal space in app)</b>
            <div className='inputs'>
              <input id='appId' type='text' placeholder='0a0a0a0a0a0a0a0a0a0a' onChange={(e) => setappId(e.target.value)} />
              <input id='changeSpace' className='button' type='button' value='set' onClick={() => changeSpace()} />
            </div>
            <b>Your spaceId (used to change type space)</b>
            <div className='inputs'>
              <input id='spaceIdChangeType' type='text' placeholder='0a0a0a0a0a0a0a0a0a0a' onChange={(e) => setspaceIdChangeType(e.target.value)} />
              <select onChange={(e) => setspaceType(e.target.value)}>
                <option value="type">select...</option> 
                <option value="2">data</option>
                <option value="1">managed</option>
                <option value="0">shared</option>
              </select>
              <input id='changeSpace' className='button' type='button' value='change' onClick={() => changeSpaceType()} />
            </div>
            <b>Your spaceId (used to clear space)</b>
            <div className='inputs'>
              <input id='spaceIdClear' type='text' placeholder='0a0a0a0a0a0a0a0a0a0a' onChange={(e) => setspaceIdClear(e.target.value)} />
              <input id='changeSpace' className='button' type='button' value='clear' onClick={() => clearSpace()} />
            </div>
            <p>{message}</p>
      </div>
    </div>
  );
}

export default App;
