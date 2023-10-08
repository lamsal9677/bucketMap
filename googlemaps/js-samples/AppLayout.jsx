import './AppLayout.scss';

const AppLayout = () => {
    
    
    
    return <div style={{
        padding: '50px 0px 0px 370px'
    }}>
        <>
        <div className='sidebar'>
        <div className="sidebar__logo">
            bucketMap
        </div>

        <div className="route-section">
        <h2 className="WhiteHeaders">Change Route</h2>
        <div className="input-group">
          <label className="Mainc">From</label>
          <input className="Mainc" 
          type="text"
          id="start"
          placeholder="Enter start location"
          />
        </div>
        <div className="input-group">
          <label className="Mainc">To</label>
          <input className="Mainc"
            type="text"
            id="end"
            placeholder="Enter end location"
          />
        </div>

        <div className="input-group">
          <label className="Mainc">Minutes</label>
          <input className="Mainc"
            type="text"
            id="end"
            placeholder="Enter minutes"
          />
        </div>
      </div> 

      <div className="button-container">
            <input type="submit" id="submit" value="Find Shortest Path" />
    </div>

    </div>
        </>
    <>
    <div id="map"></div>
    </>
    </div>;
};

export default AppLayout;
