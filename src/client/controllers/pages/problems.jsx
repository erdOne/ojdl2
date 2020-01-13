import { Component } from "react";
import axios from "axios";

import { CircularProgress } from "@material-ui/core";

import DataTable from "../../components/table.jsx";

const columns = [
  { id: "id", align: "center", numeric: true, disablePadding: true, label: "#" },
  { id: "title", align: "left", numeric: false, disablePadding: true, label: "題目"}
];



export default class Problems extends Component{
    constructor(props){
        super(props);
        this.state = {dataLoaded: false};
        axios.post("/api/get_probs")
        .then(res=>{
            this.setState({rows: res.data, dataLoaded: true});
        });
    }
    render(){
        if(this.state.dataLoaded){
            return (
                <DataTable columns={columns} rows={this.state.rows} config={{ key: "id" }} />
            );
        }else{
            return (<div style={{"textAlign": "center"}}><CircularProgress /></div>);
        }
    }
}
