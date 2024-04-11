import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllStocks, fetchSectors } from "../../redux/stock";
import { fetchScreener } from "../../redux/screener";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import AddToWatchlistModal from "../AddToWatchlistModal";
import FilterCard from "./FilterCard";
import { FaPlus } from "react-icons/fa";
import Loading from "../Loading";
import * as f from "./filters";
import "./Screener.css"

function AllStocksPage() {
    const navigate = useNavigate();
    const currencyFormat = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});
    const location = useLocation();
    const id = +location.search.split("id=")[1];
    const screeners = useSelector((state) => state.screeners);
    const screener = screeners?.screeners?.filter(item => item?.id == id)[0];
    const sectors = useSelector((state) => state.stocks.sectors);
    const [isLoaded, setIsLoaded] = useState(false);
    const [filters, setFilters] = useState({});
    const [selected, setSelected] = useState({});
    const [allStocks, setAllStocks] = useState([]);
    const stocks = id ? screeners[+id] : useSelector((state) => state.stocks.stocks);
    const applyFilters = (stocks, filters) => {
        Object.values(filters).forEach((filterCB) => {
            // console.log(typeof(filter))
            const res = stocks.filter((item) => filterCB(item))
            setAllStocks(res)
        })
    }
    const dispatch = useDispatch();

    const clearFilters = () => {
        setSelected({});
        setFilters({});
        setAllStocks(stocks);
    }

    useEffect(() => {
        setAllStocks(stocks)
    }, [stocks?.length])

    useEffect(() => {
        if (allStocks?.length) applyFilters(allStocks, filters)
        else applyFilters(stocks, filters)
    }, [filters])

    useEffect(() => {
        dispatch(fetchAllStocks());
        dispatch(fetchSectors());
        dispatch(fetchScreener(id ? +id : undefined)).then(() => setIsLoaded(true))
    }, [dispatch, id]);

    if (!isLoaded) return <Loading />
    else return (
        <div className="screener-page">
            <div className="filters">
                <h2>Filters</h2>
                <div className="filter-container">
                    <FilterCard
                        title={<h3>Average Volume</h3>}
                        attr={"avg_volume"}
                        callback={f.avg_volume}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        options={
                        <>
                            <div>
                                <label><input type="radio" name="avg_volume" value="< 50000" checked={selected.avg_volume == "< 50000"} />
                                Under 50,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="< 100000" checked={selected.avg_volume == "< 100000"}  />
                                Under 100,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="< 200000" checked={selected.avg_volume == "< 200000"}  />
                                Under 200,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="< 500000" checked={selected.avg_volume == "< 500000"}  />
                                Under 500,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="< 1000000" checked={selected.avg_volume == "< 1000000"}  />
                                Under 1,000,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="> 50000" checked={selected.avg_volume == "> 50000"}  />
                                Over 50,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="> 100000" checked={selected.avg_volume == "> 100000"}  />
                                Over 100,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="> 200000" checked={selected.avg_volume == "> 200000"}  />
                                Over 200,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="> 500000" checked={selected.avg_volume == "> 500000"}  />
                                Over 500,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="> 1000000" checked={selected.avg_volume == "> 1000000"}  />
                                Over 1,000,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="< 10000000" checked={selected.avg_volume == "< 10000000"}  />
                                Custom Range</label>
                            </div>
                        </>}
                         />
                    <FilterCard
                        title={<h3>Share Price</h3>}
                        attr={"price"}
                        callback={f.price}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        options={
                        <>
                            <label><input type="radio" name="price" value="< 10" checked={selected.price == "< 10"} />Under $10</label>
                            <label><input type="radio" name="price" value="< 50" checked={selected.price == "< 50"} />Under $50</label>
                            <label><input type="radio" name="price" value="< 100" checked={selected.price == "< 100"} />Under $100</label>
                            <label><input type="radio" name="price" value="> 10" checked={selected.price == "> 10"} />Over $10</label>
                            <label><input type="radio" name="price" value="> 50" checked={selected.price == "> 50"} />Over $50</label>
                            <label><input type="radio" name="price" value="> 100" checked={selected.price == "> 100"} />Over $100</label>
                            <label><input type="radio" name="price" value="< 100000" checked={selected.price == "< 100000"} />Custom Range</label>
                        </>} />
                    <FilterCard
                        title={<h3>52 Week Range</h3>}
                        attr={"year_range"}
                        callback={f.year_range}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        options={
                            <>
                                <label><input type="radio" name="year_range" value="> 1" checked={selected.year_range == "> 1"} />High near 1%</label>
                                <label><input type="radio" name="year_range" value="> 5" checked={selected.year_range == "> 5"} />High near 5%</label>
                                <label><input type="radio" name="year_range" value="> 20" checked={selected.year_range == "> 20"} />High near 20%</label>
                                <label><input type="radio" name="year_range" value="> 40" checked={selected.year_range == "> 40"} />High near 40%</label>
                                <label><input type="radio" name="year_range" value="< 1" checked={selected.year_range == "< 1"} />Low near 1%</label>
                                <label><input type="radio" name="year_range" value="< 5" checked={selected.year_range == "< 5"} />Low near 5%</label>
                                <label><input type="radio" name="year_range" value="< 20" checked={selected.year_range == "< 20"} />Low near 20%</label>
                                <label><input type="radio" name="year_range" value="< 40" checked={selected.year_range == "< 40"} />Low near 40%</label>
                                <label><input type="radio" name="year_range" value="< 10000000" checked={selected.year_range == "< 10000000"} />Custom Range</label>
                            </>} />
                    <FilterCard
                        title={<h3>Daily % Change</h3>}
                        attr={"past_day_return"}
                        callback={f.past_day_return}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        options={
                        <>
                            <label><input type="radio" name="past_day_return" value="> 0" checked={selected.past_day_return == "> 0" } />Up more than 0%</label>
                            <label><input type="radio" name="past_day_return" value="> 5" checked={selected.past_day_return == "> 5" } />Up more than 5%</label>
                            <label><input type="radio" name="past_day_return" value="> 10" checked={selected.past_day_return == "> 10" } />Up more than 10%</label>
                            <label><input type="radio" name="past_day_return" value="> 20" checked={selected.past_day_return == "> 20" } />Up more than 20%</label>
                            <label><input type="radio" name="past_day_return" value="< 0" checked={selected.past_day_return == "< 0" } />Down more than 0%</label>
                            <label><input type="radio" name="past_day_return" value="< 5" checked={selected.past_day_return == "< 5" } />Down more than 5%</label>
                            <label><input type="radio" name="past_day_return" value="< 10" checked={selected.past_day_return == "< 10" } />Down more than 10%</label>
                            <label><input type="radio" name="past_day_return" value="< 20" checked={selected.past_day_return == "< 20" } />Down more than 20%</label>
                            <label><input type="radio" name="past_day_return" value="> 00" checked={selected.past_day_return == "> 00" } />Custom Range</label>
                        </>} />
                    <FilterCard
                        title={<h3>Monthly % Change</h3>}
                        attr={"past_month_return"}
                        callback={f.past_month_return}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        options={
                            <>
                            <label><input type="radio" name="past_month_return" value="> 0" checked={selected.past_month_return == "> 0" } />Up more than 0%</label>
                            <label><input type="radio" name="past_month_return" value="> 5" checked={selected.past_month_return == "> 5" } />Up more than 5%</label>
                            <label><input type="radio" name="past_month_return" value="> 10" checked={selected.past_month_return == "> 10" } />Up more than 10%</label>
                            <label><input type="radio" name="past_month_return" value="> 20" checked={selected.past_month_return == "> 20" } />Up more than 20%</label>
                            <label><input type="radio" name="past_month_return" value="> 30" checked={selected.past_month_return == "> 30" } />Up more than 30%</label>
                            <label><input type="radio" name="past_month_return" value="< 0" checked={selected.past_month_return == "< 0" } />Down more than 0%</label>
                            <label><input type="radio" name="past_month_return" value="< 5" checked={selected.past_month_return == "< 5" } />Down more than 5%</label>
                            <label><input type="radio" name="past_month_return" value="< 10" checked={selected.past_month_return == "< 10" } />Down more than 10%</label>
                            <label><input type="radio" name="past_month_return" value="< 20" checked={selected.past_month_return == "< 20" } />Down more than 20%</label>
                            <label><input type="radio" name="past_month_return" value="< 30" checked={selected.past_month_return == "< 30" } />Down more than 30%</label>
                            <label><input type="radio" name="past_month_return" value="> 00" checked={selected.past_month_return == "> 00" } />Custom Range</label>
                            </>} />
                    <FilterCard
                        title={<h3>Yearly % Change</h3>}
                        attr={"past_year_return"}
                        callback={f.past_year_return}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        options={
                            <>
                            <label><input type="radio" name="past_year_return" value="> 0" checked={selected.past_year_return == "> 0" } />Up more than 0%</label>
                            <label><input type="radio" name="past_year_return" value="> 5" checked={selected.past_year_return == "> 5" } />Up more than 5%</label>
                            <label><input type="radio" name="past_year_return" value="> 10" checked={selected.past_year_return == "> 10" } />Up more than 10%</label>
                            <label><input type="radio" name="past_year_return" value="> 20" checked={selected.past_year_return == "> 20" } />Up more than 20%</label>
                            <label><input type="radio" name="past_year_return" value="> 30" checked={selected.past_year_return == "> 30" } />Up more than 30%</label>
                            <label><input type="radio" name="past_year_return" value="> 40" checked={selected.past_year_return == "> 40" } />Up more than 40%</label>
                            <label><input type="radio" name="past_year_return" value="> 50" checked={selected.past_year_return == "> 50" } />Up more than 50%</label>
                            <label><input type="radio" name="past_year_return" value="< 0" checked={selected.past_year_return == "< 0" } />Down more than 0%</label>
                            <label><input type="radio" name="past_year_return" value="< 5" checked={selected.past_year_return == "< 5" } />Down more than 5%</label>
                            <label><input type="radio" name="past_year_return" value="< 10" checked={selected.past_year_return == "< 10" } />Down more than 10%</label>
                            <label><input type="radio" name="past_year_return" value="< 20" checked={selected.past_year_return == "< 20" } />Down more than 20%</label>
                            <label><input type="radio" name="past_year_return" value="< 30" checked={selected.past_year_return == "< 30" } />Down more than 30%</label>
                            <label><input type="radio" name="past_year_return" value="< 40" checked={selected.past_year_return == "< 40" } />Down more than 40%</label>
                            <label><input type="radio" name="past_year_return" value="< 50" checked={selected.past_year_return == "< 50" } />Down more than 50%</label>
                            <label><input type="radio" name="past_year_return" value="> 00" checked={selected.past_year_return == "> 00" } />Custom Range</label>
                        </>} />
                    <FilterCard
                        title={<h3>Yearly % Change Over Market</h3>}
                        attr={"past_outperformance"}
                        callback={f.past_outperformance}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        options={
                            <>
                            <label><input type="radio" name="past_outperformance" value="> 0" checked={selected.past_outperformance == "> 0" } />Beat by 0%</label>
                            <label><input type="radio" name="past_outperformance" value="> 5" checked={selected.past_outperformance == "> 5" } />Beat by 5%</label>
                            <label><input type="radio" name="past_outperformance" value="> 10" checked={selected.past_outperformance == "> 10" } />Beat by 10%</label>
                            <label><input type="radio" name="past_outperformance" value="> 20" checked={selected.past_outperformance == "> 20" } />Beat by 20%</label>
                            <label><input type="radio" name="past_outperformance" value="> 30" checked={selected.past_outperformance == "> 30" } />Beat by 30%</label>
                            <label><input type="radio" name="past_outperformance" value="> 40" checked={selected.past_outperformance == "> 40" } />Beat by 40%</label>
                            <label><input type="radio" name="past_outperformance" value="> 50" checked={selected.past_outperformance == "> 50" } />Beat by 50%</label>
                            <label><input type="radio" name="past_outperformance" value="< 0" checked={selected.past_outperformance == "< 0" } />Under by 0%</label>
                            <label><input type="radio" name="past_outperformance" value="< 5" checked={selected.past_outperformance == "< 5" } />Under by 5%</label>
                            <label><input type="radio" name="past_outperformance" value="< 10" checked={selected.past_outperformance == "< 10" } />Under by 10%</label>
                            <label><input type="radio" name="past_outperformance" value="< 20" checked={selected.past_outperformance == "< 20" } />Under by 20%</label>
                            <label><input type="radio" name="past_outperformance" value="< 30" checked={selected.past_outperformance == "< 30" } />Under by 30%</label>
                            <label><input type="radio" name="past_outperformance" value="< 40" checked={selected.past_outperformance == "< 40" } />Under by 40%</label>
                            <label><input type="radio" name="past_outperformance" value="< 50" checked={selected.past_outperformance == "< 50" } />Under by 50%</label>
                            <label><input type="radio" name="past_outperformance" value="> 00" checked={selected.past_outperformance == "> 00" } />Custom Range</label>
                        </>} />
                    <FilterCard
                        title={<h3>Market Cap</h3>}
                        attr={"market_cap"}
                        callback={f.market_cap}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        options={
                        <>
                            <label><input type="radio" name="market_cap" value="[ 300 2000 ]" checked={selected.market_cap == "[ 300 2000 ]"} />Small Cap ($300M - $2B)</label>
                            <label><input type="radio" name="market_cap" value="[ 2000 10000 ]" checked={selected.market_cap == "[ 2000 10000 ]"} />Mid Cap ($2B - $10B)</label>
                            <label><input type="radio" name="market_cap" value="> 10000" checked={selected.market_cap == "> 10000"} />Large Cap ($10B+)</label>
                            <label><input type="radio" name="market_cap" value="> 200000" checked={selected.market_cap == "> 200000"} />Mega Cap ($200B+)</label>
                            <label><input type="radio" name="market_cap" value="00000" checked={selected.market_cap == "00000"} />Custom Range</label>
                        </>} />
                    <FilterCard
                        title={<h3>Sector</h3>}
                        attr={"sector"}
                        callback={f.sector}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        options={
                        <>
                            {sectors?.map((sector, index) => (<label key={index}><input type="radio" name="sector" value={sector} checked={selected.sector == sector} />{sector}</label> ))}
                        </>} />
                    <FilterCard
                        title={<h3>Shares Outstanding</h3>}
                        options={
                        <>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Under 1M</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Under 5M</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Under 20M</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Under 50M</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Under 100M</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 1M</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 5M</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 20M</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 50M</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 100M</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Custom Range</label>
                        </>} />
                    <FilterCard
                        title={<h3>Short Interest %</h3>}
                        options={
                        <>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Under 1%</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Under 5%</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Under 10%</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 1%</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 5%</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 10%</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 15%</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 20%</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Custom Range</label>
                        </>}/>
                    <FilterCard
                        title={<h3>Analyst Ratings</h3>}
                        options={
                        <>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Buy</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Hold</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Mixed</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Sell</label>
                        </>} />
                    <FilterCard
                        title={<h3>Dividend Yield</h3>}
                        options={
                        <>
                            <input type="radio" name="avg_volume" /><label htmlFor="">None</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">2% or Less</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 2%</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Over 5%</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Custom Range</label>
                        </>} />
                    <FilterCard
                        title={<h3>Trailing PE Ratio</h3>}
                        options={
                        <div>
                            <input type="radio" name="avg_volume" /><label htmlFor="">More than 0</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">More than 5</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">More than 15</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">More than 20</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">More than 50</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Less than 20</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Less than 50</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Custom Range</label>
                        </div>} />
                    <FilterCard
                        title={<h3>Forward PE Ratio</h3>}
                        options={<div>
                            <input type="radio" name="avg_volume" /><label htmlFor="">More than 0</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">More than 5</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">More than 15</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">More than 20</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">More than 50</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Less than 20</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Less than 50</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Custom Range</label>
                        </div>} />
                    <FilterCard
                        title={<h3>Price to Book Ratio</h3>}
                        options={<div>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Less than 5</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">More than 5</label>
                            <input type="radio" name="avg_volume" /><label htmlFor="">Custom Range</label>
                        </div>} />
                </div>
                <button onClick={() => clearFilters()}>Clear Filters</button>
                <button>Save Screener</button>
            </div>
            <div className="all-stocks">
                <div className="screener-header">
                    <h2>{screener?.name || "All Stocks"}</h2>
                    {<p>{allStocks?.length} items</p>}{/*· Updated */}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Ticker</th>
                            <th scope="col">Name</th>
                            <th scope="col">1D % Change</th>
                            <th scope="col">Price</th>
                            <th scope="col">Avg Volume</th>
                            <th scope="col">Mkt Cap</th>
                            <th scope="col">1M % Change</th>
                            <th scope="col">1Y % Change</th>
                            <th scope="col">1Y % Change over Mkt</th>
                            <th scope="col">Watch</th>
                        </tr>
                    </thead>
                    <tbody>
                    {allStocks?.map((stock) => (
                        <tr className="stock-card" onClick={() => navigate(`/stocks/${stock.ticker}`)} key={stock.ticker}>
                            <th scope="row">{stock.ticker}</th>
                            <td>{stock.name}</td>
                            <td>{(stock.past_day_return * 100).toFixed(2)}%</td>
                            <td>{currencyFormat.format(stock.price)}</td>
                            <td>{stock.avg_volume.toLocaleString("en", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}</td>
                            <td>${stock.market_cap.toLocaleString("en", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })} M</td>
                            <td>{(stock.past_month_return * 100).toFixed(2)}%</td>
                            <td>{(stock.past_year_return * 100).toFixed(2)}%</td>
                            <td>{(stock.past_outperformance * 100).toFixed(2)}%</td>
                            <td>
                                <OpenModalButton
                                    buttonText={<FaPlus/>}
                                    modalComponent={<AddToWatchlistModal stock={stock} ticker={stock.ticker}/>}/>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        )
}

export default AllStocksPage
