import React, {Component} from 'react';
import Announcement from './announcement/Annoucement';
import AnnouncementInfo from './announcement/AnnouncementInfo.js';
import AnnouncementFoundItems from './announcement/AnnouncementFoundItems';

class AnnoucementList extends Component{
    constructor(props){
        super(props);
        this.state = {
            announcementList: [
                {
                    title: 'None',
                    description: 'None'
                }
            ],
            foundElemsList: [
                {
                    title: 'None',
                    description: 'None'
                }
            ],
            isOpen: false,
            isFound: false,
            isEdit: false,
            seen: false,
            idx: 0,
            targetList: [{}],
            similarList: [{}]
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputSearch = this.handleInputSearch.bind(this);
    }

    // Show info
    togglePop = (i) => {
        this.setState(state => {
            const newList = state.announcementList.filter((item, j) => i === j);
            if(this.state.seen===false){
                const similar = state.announcementList.map((item,index) => {
                    let el = {...item};
                    let titleArr = el.title.split(' ');
                    let descArr = el.description.split(' ');
                    let totalArr = {};
                    let foundTitle = false;
                    let foundDesc = false;
                    if(el.title === newList[0].title || el.title.toLowerCase() === newList[0].title.toLowerCase() || titleArr.find(x =>x.toLowerCase()===newList[0].title.toLowerCase())){
                        totalArr.title=el.title;
                        foundTitle = true;
                    }
                    if (foundTitle === true) { totalArr.description = el.description; }
                    if(el.description === newList[0].description || el.description.toLowerCase() === newList[0].description.toLowerCase() || descArr.find(x => x.toLowerCase()===newList[0].description.toLowerCase()?true:false)){
                        totalArr.description=el.description;
                        foundDesc = true;
                    }
                    if(foundDesc === true) { totalArr.title = el.title; }
                    return totalArr;
                });
                return {
                    similarList: similar,
                    targetList: [...newList],
                    seen: !(this.state.seen)
                }
            }
            return {
                targetList: [...newList],
                seen: !(this.state.seen)
            };
        });
    };

    //Adding items to the list
    onAddItem = () => {
        this.setState(state => {
          return {
            announcementList: [...state.announcementList, {"title":state.title, 'description':state.description}],
            isOpen: false
          };
      });
    };

    //Handle with inputs
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
     };

     //Handle only with search input 
     handleInputSearch(e) {
         const val = e.target.value;
         const name = e.target.name;

         this.setState({
             [name]: val
         });
     }
     
    //Removing items from the list
    onRemoveItem = i => {
        this.setState(state => {
          const newList = state.announcementList.filter((item, j) => i !== j);
          return {
            announcementList: [...newList],
          };
        });
      };
    
    //Searching items
    onSearchItem = () => {
        this.setState(state => {
            const filteredList = state.announcementList.filter((item,idx) => {
                let p = {...item};
                let arr = p.title.split(' ');
                if(p.title === state.title || p.title.toLowerCase() === state.title.toLowerCase() || arr.find(x => x.toLowerCase()===state.title.toLowerCase())){
                    return p
                }
                return null;
            });
            if(!state.title || filteredList.length===0) {                
                return {
                    isFound: false
                }
            }else{
                return {
                    foundElemsList: [...filteredList],
                    isFound: true
                }
            }
        })}

    //Edit items     
    onEditItem = () => {
        this.setState(state => {
          const list = state.announcementList.map((item,j) => {
            if(j===state.idx){
                return ({...item, 'title': state.title, 'description': state.description});
            }else {
                return item;
            }
          })
          return {
            announcementList: list,
            isEdit: false
          };
        });
      };

    render(){
        const elems = this.state.announcementList.map((elem, index) =>
            <li key = {index} style={{paddingTop: "10px"}}>
                <Announcement  announcement={elem}/>
                <div className="card-text" style={{background: '#f2f2f2', padding: '10px'}}>
                    <button className="btn btn-primary " style={{marginRight:"10px"}} onClick={()=>{this.setState({isEdit: true, idx: index});}}>Edit</button>
                    <button className="btn btn-info" onClick={()=>this.togglePop(index)} style={{float:'right'}}>Show Info</button>
                    <button className="btn btn-danger" type="button" onClick={()=>this.onRemoveItem(index)}>Delete</button>
                </div>
            </li>
        );
        const foundElems = this.state.foundElemsList.map((item,index)=> {
            return(
            <li key={index}>
                <AnnouncementFoundItems announcement={item} i={index} />
            </li>
            )
        });
        if(this.state.isEdit === true) {
            return(
                <div className="card-header" style={{width:"35%"}}>
                     <label className="input-group">
                         <h5 style={{paddingRight: "3%"}}>Title:</h5>
                         <input style={{height: "30px"}} className="form-control" type="text" name="title" onChange={this.handleInputChange}/>
                     </label>
                     <label className="input-group" style={{marginTop:"1%", marginBottom: "2%"}}>
                     <h5 style={{paddingRight: "3%"}}>Description:</h5>
                         <input style={{height: "30px"}} className="form-control" type="text" name="description" onChange={this.handleInputChange} />
                     </label>
                     <button type="submit" className="btn btn-primary" style={{width:"100%"}} value="Add" onClick = {this.onEditItem}>Save</button>
                </div>
            )
        }
        if(this.state.isOpen === false && this.state.isEdit===false){
            return(
                <div>
                    {this.state.seen ?
                        null :
                        <div>
                            <button className="btn btn-success" onClick={this.handleClick}>Add</button>
                            <label className="input-group" style={{width:"25%", float: "right"}}>
                                <input className="form-control" type="text" name="title" onChange={this.handleInputSearch} />
                                <button className="btn btn-secondary" onClick={this.onSearchItem}>Search</button>
                            </label>
                        </div>
                    }
                     {this.state.isFound ?
                     
                    <ul className="list-unstyled">
                        <h1>Found Annoucement:</h1>
                        <li>
                             {foundElems}
                             <button className="btn btn-warning" style={{marginTop:"1%"}} onClick={()=>{this.setState({isFound: false})}}>Back</button>
                        </li>
                    </ul>
                    :
                    <div>
                        <ul className="list-unstyled">
                            <li>
                                {this.state.seen ? <AnnouncementInfo toggle={this.togglePop} announcement={this.state.targetList} announcementList={this.state.similarList}/> :elems}
                            </li>
                        </ul>
                    </div>
                    }
                </div>
            )
        }if(this.state.isOpen === true) {
            return(
                <div className="card-header" style={{width:"35%"}}>
                     <label className="input-group">
                         <h5 style={{paddingRight: "3%"}}>Title:</h5>
                         <input style={{height: "30px"}} className="form-control" type="text" name="title" onChange={this.handleInputChange}/>
                     </label>
                     <label className="input-group" style={{marginTop:"1%", marginBottom: "2%"}}>
                     <h5 style={{paddingRight: "3%"}}>Description:</h5>
                         <input style={{height: "30px"}} className="form-control" type="text" name="description" onChange={this.handleInputChange} />
                     </label>
                     <input type="submit" className="btn btn-success" style={{width:"100%"}} value="Add" onClick = {this.onAddItem}/>
                </div>
            )
        }
    }

    //Showing add inputs
    handleClick = () => {
        this.setState({
            isOpen:true
        })
    }

    //Showing edit inputs
    handleEdit = () => {
        this.setState({isEdit: true});
      }
}

export default AnnoucementList;