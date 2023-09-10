import { useEffect, useRef } from "react";
import { store } from "../store/store"

export default function ActionList() {
    const { actions } = store()

    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [actions.keys()]);

    return (
        <div style={{ width: 200, height: 260, lineHeight: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 10, borderRadius: 15 }}>
            <p style={{marginTop:5}}>Actions</p>
            <div className="scrollable-list" ref={listRef}>
                {actions.map((item, index) => (
                    <div key={index} className="list-item">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    )
}