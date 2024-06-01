import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import '../Recommendations/Recommendations.css'
function Recommendations() {

    const dispatch = useDispatch();
    const history = useHistory();
    const recommendations = useSelector(store => store.weatherReducer.recommendations);
    const singleList = useSelector(store => store.listsReducer.lists[0]);
    const { list_id } = useParams();

    useEffect(() => {
        dispatch({
            type: 'GET_SINGLE_LIST',
            payload: {listId: list_id } });
        
    }, [list_id])

    const handleLoadListAndFocus = (itemId, listId) => {
        history.push(`/list_items/${listId}/${itemId}`);
      }
    const handleLoadList = () => {
        history.push(`/list_items/${list_id}/0`);
    }

    return (
        <main>
            <h2 className="med-font">RECOMMENDATIONS FOR <br/><span className="lg-font">{singleList?.description}</span> </h2>
            <button onClick={handleLoadList}>BACK TO LIST</button>
            <div className="divider"></div>
            <h3 className="rec-header">{recommendations[0]?.header + ':'}</h3>
            <section>{recommendations.map(rec => {
                return (
                     <>
                        <article key={rec?.id}
                                className="rec-item">
                            <p className="rec-item-title inline-block med-lg-font">{rec?.recommendation_number}. {rec?.todo_desc}</p>
                            <p className="rec-item-desc inline-block">{rec?.recommend_desc}</p>
                            <button className="rec-item-goto-button inline-block med-font"
                                    onClick={() => handleLoadListAndFocus(rec.todo_id, rec.list_id)}>Go To<br></br>Item</button>
                        </article>
                    </>
                )
            })}
            </section>
        </main>
    )
}

export default Recommendations;