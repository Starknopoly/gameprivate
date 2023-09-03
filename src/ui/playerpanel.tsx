export default function PlayerPanel(){
    return(
    <div>
        <div style={{width:200,height:200,lineHeight:1, backgroundColor:"rgba(0, 0, 0, 0.5)",padding:10, borderRadius:15}}>
            <p style={{color:"white"}}>Player Status</p>
            <p>Money : $1000</p>
            <p>Energy : 100</p>
            <p>Bank : 0</p>
            <p>Hotel : 0</p>
            <p>Starkbucks : 0</p>
        </div>
    </div>)
}