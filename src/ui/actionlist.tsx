import { store } from "../store/store"

export default function ActionList(){
    const {actions} =  store()

    return(
        <div style={{ width: 200, height: 240, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
            Actions
            {
                actions.map((value,index)=>{
                    return <p key={value}>{value}</p>
                })
            }
        </div>
    )
}