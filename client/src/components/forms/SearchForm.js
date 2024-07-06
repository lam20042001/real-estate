import { useSearch } from "../../context/search";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const sellPrices = [
    {
        _id: 0,
        name: "All price",
        array: [0, 1000000000000000],
    },
    {
        _id: 1,
        name: "0 to 1.000.000.000",
        array: [1000000000, 3000000000],
    },
    {
        _id: 2,
        name: "1.000.000.000 to 3.000.000.000",
        array: [1000000000, 3000000000],
    },
    {
        _id: 3,
        name: "3.000.000.000 to 10.000.000.000",
        array: [3000000000, 10000000000],
    },
    {
        _id: 4,
        name: "over 10.000.000.000",
        array: [10000000000, 10000000000000000],
    },
];

const rentPrices = [
    {
        _id: 0,
        name: "All price",
        array: [0, 100000000000],
    },
    {
        _id: 1,
        name: "0 to 5.000.000",
        array: [0, 5000000],
    },
    {
        _id: 2,
        name: "5.000.000 to 20.000.000",
        array: [5000000, 20000000],
    },
    {
        _id: 3,
        name: "20.000.000 to 100.000.000",
        array: [20000000, 100000000],
    },
    {
        _id: 4,
        name: "over 100.000.000",
        array: [100000000, 1000000000000],
    },
];
export default function SearchForm() {
    const [search, setSearch] = useSearch();
    const navigate = useNavigate();
    const handleSearch = async () => {
        setSearch({ ...search, loading: false });
        try {
            const { results, page, price,loading,address, ...rest } = search;
            const query = queryString.stringify(rest);
            const { data } = await axios.get(`/search?${query}`);
            if (search?.page !== "/search") {
                setSearch((prev) => ({ ...prev, results: data, loading: false }));
                navigate("/search");
            } else {

                setSearch((prev) => ({
                    ...prev,
                    results: data,
                    page: window.location.pathname,
                    loading: false,
                }));
            }
        } catch (err) {
            console.log(err);
            setSearch({ ...search, loading: false });
        }
    };
    return (
        <>
            <div className="container m-5">
                <div className="d-flex justify-content-center mt-3">
                    <button
                        onClick={() => setSearch({ ...search, action: "buy", price: "" })}
                        className="btn btn-primary col-lg-2 square"
                    >
                        {search.action === "buy" ? "✅ Buy" : "Buy"}
                    </button>
                    <button
                        onClick={() => setSearch({ ...search, action: "rent", price: "" })}
                        className="btn btn-primary col-lg-2 square"
                    >
                        {search.action === "rent" ? "✅ Rent" : "Rent"}
                    </button>
                    <div className="dropdown">
                        <button
                            className="btn btn-primary dropdown-toggle square"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            &nbsp; {search?.price ? search.price : "Choose price range"}
                        </button>
                        <ul className="dropdown-menu">
                            {search.action === "buy" ? (
                                <>
                                    {sellPrices.map((item) => (
                                        <li key={item._id}>
                                            <a
                                                onClick={() => {
                                                    setSearch({
                                                        ...search,
                                                        price: item.name,
                                                        priceRange: item.array,
                                                    });
                                                }}
                                                className="dropdown-item"
                                            >
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {rentPrices.map((item) => (
                                        <li key={item._id}>
                                            <a
                                                onClick={() => {
                                                    setSearch({
                                                        ...search,
                                                        price: item.name,
                                                        priceRange: item.array,
                                                    });
                                                }}
                                                className="dropdown-item"
                                            >
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </>
                            )}
                        </ul>
                    </div>

                    <button
                        onClick={handleSearch}
                        className="btn btn-danger col-lg-2 square"
                    >
                        Search
                    </button>
                </div>
            </div>
        </>
    );
}
