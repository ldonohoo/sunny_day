import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";

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

    const handleLoadListAndFocus = (listId, itemId) => {
        history.push(`/list_items/${listId}/${list.itemId}`);
      }
    const handleLoadList = () => {
        history.push(`/list_items/${list_id}/0`);
    }

    return (
        <main>
            <h2>Recommendations for {singleList?.description}</h2>
            <button onClick={handleLoadList}>BACK TO LIST</button>
            {/* <section>{recommendations.map(recommendation => {
                return (
                    <>
                        <h3 key={recommendation.id}>{recommendation.detail}</h3>
                        <button></button>
                        <button></button>
                        <button onClick={() => handleLoadListAndFocus(recommendation.item_id, recommendations.list_id)}>GO TO ITEM</button>
                    </>
                )
            })}
            </section> */}
        </main>
    )
}

export default Recommendations;