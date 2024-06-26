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
import CreateScreenerModal from "./CreateScreenerModal";

function AllStocksPage() {
    const navigate = useNavigate();
    const currencyFormat = new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"});
    const location = useLocation();
    const id = +location.search.split("id=")[1];
    const screeners = useSelector((state) => state.screeners);
    const screener = screeners?.screeners?.filter(item => item?.id == id)[0];
    const screenedStocks = screeners ? screeners[+id] : null;
    const sectors = useSelector((state) => state.stocks.sectors);
    const [isLoaded, setIsLoaded] = useState(false);
    const [filters, setFilters] = useState({});
    const [selected, setSelected] = useState({});
    const [allStocks, setAllStocks] = useState([]);
    const stocks = useSelector((state) => state.stocks.stocks);
    // const stocks = id ? screeners[+id] : useSelector((state) => state.stocks.stocks);
    const applyFilters = (stocks, filters) => {
        if (Object.keys(filters).length) {
            const res = stocks?.filter(item => {
                return Object.values(filters).map((filterCB) => filterCB(item)).every((x => x === true))
            })
            setAllStocks(res);
        }
        // Object.values(filters).forEach((filterCB) => {
        //     const res = stocks.filter((item) => filterCB(item))
        //     setAllStocks(res)
        // })
    }
    const dispatch = useDispatch();

    const clearFilters = () => {
        setSelected({});
        setFilters({});
        setAllStocks(stocks);
    }

    useEffect(() => {
        clearFilters();
    }, [id])

    useEffect(() => {
        if (id) {
            setAllStocks(screenedStocks)
            setSelected(screener?.params)
        } else setAllStocks(stocks)
        if (screener || id==0) setIsLoaded(true)
    }, [stocks?.length, id, screenedStocks?.length, screener?.params])

    useEffect(() => {
        applyFilters(allStocks, filters)
    }, [filters])

    // useEffect(() => {
    //     if (allStocks?.length) setIsLoaded(true)
    // }, [allStocks?.length])

    useEffect(() => {
        const loadData = async () => {
            await dispatch(fetchAllStocks());
            await dispatch(fetchSectors());
            await dispatch(fetchScreener(id ? +id : undefined))
        }
        loadData();
    }, [dispatch, id]);

    if (!isLoaded) return <Loading />
    else return (
        <div className="screener-page">
            <div className="filters">
                <h2>Filters</h2>
                <div className="filter-container">
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Average Volume</h3>}
                        attr={"avg_volume"}
                        callback={f.avg_volume}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={10000}
                        max={80000000}
                        options={
                        <>
                            <div>
                                <label><input type="radio" name="avg_volume" value="< 50000" readOnly checked={selected?.avg_volume == "< 50000"} />
                                Under 50,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="< 100000" readOnly checked={selected?.avg_volume == "< 100000"}  />
                                Under 100,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="< 200000" readOnly checked={selected?.avg_volume == "< 200000"}  />
                                Under 200,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="< 500000" readOnly checked={selected?.avg_volume == "< 500000"}  />
                                Under 500,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="< 1000000" readOnly checked={selected?.avg_volume == "< 1000000"}  />
                                Under 1,000,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="> 50000" readOnly checked={selected?.avg_volume == "> 50000"}  />
                                Over 50,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="> 100000" readOnly checked={selected?.avg_volume == "> 100000"}  />
                                Over 100,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="> 200000" readOnly checked={selected?.avg_volume == "> 200000"}  />
                                Over 200,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="> 500000" readOnly checked={selected?.avg_volume == "> 500000"}  />
                                Over 500,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="> 1000000" readOnly checked={selected?.avg_volume == "> 1000000"}  />
                                Over 1,000,000</label>
                            </div>
                            <div>
                                <label><input type="radio" name="avg_volume" value="custom" readOnly checked={selected?.avg_volume?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>}
                         />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Share Price</h3>}
                        attr={"price"}
                        callback={f.price}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={2}
                        max={10000}
                        options={
                        <>
                            <label><input type="radio" name="price" value="< 10" readOnly checked={selected?.price == "< 10"} />Under $10</label>
                            <label><input type="radio" name="price" value="< 50" readOnly checked={selected?.price == "< 50"} />Under $50</label>
                            <label><input type="radio" name="price" value="< 100" readOnly checked={selected?.price == "< 100"} />Under $100</label>
                            <label><input type="radio" name="price" value="> 10" readOnly checked={selected?.price == "> 10"} />Over $10</label>
                            <label><input type="radio" name="price" value="> 50" readOnly checked={selected?.price == "> 50"} />Over $50</label>
                            <label><input type="radio" name="price" value="> 100" readOnly checked={selected?.price == "> 100"} />Over $100</label>
                            <div>
                                <label><input type="radio" name="price" value="custom" readOnly checked={selected?.price?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
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
                                <label><input type="radio" name="year_range" value="> 1" readOnly checked={selected?.year_range == "> 1"} />High near 1%</label>
                                <label><input type="radio" name="year_range" value="> 5" readOnly checked={selected?.year_range == "> 5"} />High near 5%</label>
                                <label><input type="radio" name="year_range" value="> 20" readOnly checked={selected?.year_range == "> 20"} />High near 20%</label>
                                <label><input type="radio" name="year_range" value="> 40" readOnly checked={selected?.year_range == "> 40"} />High near 40%</label>
                                <label><input type="radio" name="year_range" value="< 1" readOnly checked={selected?.year_range == "< 1"} />Low near 1%</label>
                                <label><input type="radio" name="year_range" value="< 5" readOnly checked={selected?.year_range == "< 5"} />Low near 5%</label>
                                <label><input type="radio" name="year_range" value="< 20" readOnly checked={selected?.year_range == "< 20"} />Low near 20%</label>
                                <label><input type="radio" name="year_range" value="< 40" readOnly checked={selected?.year_range == "< 40"} />Low near 40%</label>
                            </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Daily % Change</h3>}
                        attr={"past_day_return"}
                        callback={f.past_day_return}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={-100}
                        max={200}
                        options={
                        <>
                            <label><input type="radio" name="past_day_return" value="> 0" readOnly checked={selected?.past_day_return == "> 0" } />Up more than 0%</label>
                            <label><input type="radio" name="past_day_return" value="> 5" readOnly checked={selected?.past_day_return == "> 5" } />Up more than 5%</label>
                            <label><input type="radio" name="past_day_return" value="> 10" readOnly checked={selected?.past_day_return == "> 10" } />Up more than 10%</label>
                            <label><input type="radio" name="past_day_return" value="> 20" readOnly checked={selected?.past_day_return == "> 20" } />Up more than 20%</label>
                            <label><input type="radio" name="past_day_return" value="< 0" readOnly checked={selected?.past_day_return == "< 0" } />Down more than 0%</label>
                            <label><input type="radio" name="past_day_return" value="< 5" readOnly checked={selected?.past_day_return == "< 5" } />Down more than 5%</label>
                            <label><input type="radio" name="past_day_return" value="< 10" readOnly checked={selected?.past_day_return == "< 10" } />Down more than 10%</label>
                            <label><input type="radio" name="past_day_return" value="< 20" readOnly checked={selected?.past_day_return == "< 20" } />Down more than 20%</label>
                            <div>
                                <label><input type="radio" name="past_day_return" value="custom" readOnly checked={selected?.past_day_return?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Monthly % Change</h3>}
                        attr={"past_month_return"}
                        callback={f.past_month_return}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={-100}
                        max={200}
                        options={
                            <>
                            <label><input type="radio" name="past_month_return" value="> 0" readOnly checked={selected?.past_month_return == "> 0" } />Up more than 0%</label>
                            <label><input type="radio" name="past_month_return" value="> 5" readOnly checked={selected?.past_month_return == "> 5" } />Up more than 5%</label>
                            <label><input type="radio" name="past_month_return" value="> 10" readOnly checked={selected?.past_month_return == "> 10" } />Up more than 10%</label>
                            <label><input type="radio" name="past_month_return" value="> 20" readOnly checked={selected?.past_month_return == "> 20" } />Up more than 20%</label>
                            <label><input type="radio" name="past_month_return" value="> 30" readOnly checked={selected?.past_month_return == "> 30" } />Up more than 30%</label>
                            <label><input type="radio" name="past_month_return" value="< 0" readOnly checked={selected?.past_month_return == "< 0" } />Down more than 0%</label>
                            <label><input type="radio" name="past_month_return" value="< 5" readOnly checked={selected?.past_month_return == "< 5" } />Down more than 5%</label>
                            <label><input type="radio" name="past_month_return" value="< 10" readOnly checked={selected?.past_month_return == "< 10" } />Down more than 10%</label>
                            <label><input type="radio" name="past_month_return" value="< 20" readOnly checked={selected?.past_month_return == "< 20" } />Down more than 20%</label>
                            <label><input type="radio" name="past_month_return" value="< 30" readOnly checked={selected?.past_month_return == "< 30" } />Down more than 30%</label>
                            <div>
                                <label><input type="radio" name="past_month_return" value="custom" readOnly checked={selected?.past_month_return?.startsWith("custom")}/>Custom Range</label>
                            </div>
                            </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Yearly % Change</h3>}
                        attr={"past_year_return"}
                        callback={f.past_year_return}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={-100}
                        max={500}
                        options={
                            <>
                            <label><input type="radio" name="past_year_return" value="> 0" readOnly checked={selected?.past_year_return == "> 0" } />Up more than 0%</label>
                            <label><input type="radio" name="past_year_return" value="> 5" readOnly checked={selected?.past_year_return == "> 5" } />Up more than 5%</label>
                            <label><input type="radio" name="past_year_return" value="> 10" readOnly checked={selected?.past_year_return == "> 10" } />Up more than 10%</label>
                            <label><input type="radio" name="past_year_return" value="> 20" readOnly checked={selected?.past_year_return == "> 20" } />Up more than 20%</label>
                            <label><input type="radio" name="past_year_return" value="> 30" readOnly checked={selected?.past_year_return == "> 30" } />Up more than 30%</label>
                            <label><input type="radio" name="past_year_return" value="> 40" readOnly checked={selected?.past_year_return == "> 40" } />Up more than 40%</label>
                            <label><input type="radio" name="past_year_return" value="> 50" readOnly checked={selected?.past_year_return == "> 50" } />Up more than 50%</label>
                            <label><input type="radio" name="past_year_return" value="< 0" readOnly checked={selected?.past_year_return == "< 0" } />Down more than 0%</label>
                            <label><input type="radio" name="past_year_return" value="< 5" readOnly checked={selected?.past_year_return == "< 5" } />Down more than 5%</label>
                            <label><input type="radio" name="past_year_return" value="< 10" readOnly checked={selected?.past_year_return == "< 10" } />Down more than 10%</label>
                            <label><input type="radio" name="past_year_return" value="< 20" readOnly checked={selected?.past_year_return == "< 20" } />Down more than 20%</label>
                            <label><input type="radio" name="past_year_return" value="< 30" readOnly checked={selected?.past_year_return == "< 30" } />Down more than 30%</label>
                            <label><input type="radio" name="past_year_return" value="< 40" readOnly checked={selected?.past_year_return == "< 40" } />Down more than 40%</label>
                            <label><input type="radio" name="past_year_return" value="< 50" readOnly checked={selected?.past_year_return == "< 50" } />Down more than 50%</label>
                            <div>
                                <label><input type="radio" name="past_year_return" value="custom" readOnly checked={selected?.past_year_return?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Yearly % Change Over Market</h3>}
                        attr={"past_outperformance"}
                        callback={f.past_outperformance}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={-100}
                        max={200}
                        options={
                            <>
                            <label><input type="radio" name="past_outperformance" value="> 0" readOnly checked={selected?.past_outperformance == "> 0" } />Beat by 0%</label>
                            <label><input type="radio" name="past_outperformance" value="> 5" readOnly checked={selected?.past_outperformance == "> 5" } />Beat by 5%</label>
                            <label><input type="radio" name="past_outperformance" value="> 10" readOnly checked={selected?.past_outperformance == "> 10" } />Beat by 10%</label>
                            <label><input type="radio" name="past_outperformance" value="> 20" readOnly checked={selected?.past_outperformance == "> 20" } />Beat by 20%</label>
                            <label><input type="radio" name="past_outperformance" value="> 30" readOnly checked={selected?.past_outperformance == "> 30" } />Beat by 30%</label>
                            <label><input type="radio" name="past_outperformance" value="> 40" readOnly checked={selected?.past_outperformance == "> 40" } />Beat by 40%</label>
                            <label><input type="radio" name="past_outperformance" value="> 50" readOnly checked={selected?.past_outperformance == "> 50" } />Beat by 50%</label>
                            <label><input type="radio" name="past_outperformance" value="< 0" readOnly checked={selected?.past_outperformance == "< 0" } />Under by 0%</label>
                            <label><input type="radio" name="past_outperformance" value="< 5" readOnly checked={selected?.past_outperformance == "< 5" } />Under by 5%</label>
                            <label><input type="radio" name="past_outperformance" value="< 10" readOnly checked={selected?.past_outperformance == "< 10" } />Under by 10%</label>
                            <label><input type="radio" name="past_outperformance" value="< 20" readOnly checked={selected?.past_outperformance == "< 20" } />Under by 20%</label>
                            <label><input type="radio" name="past_outperformance" value="< 30" readOnly checked={selected?.past_outperformance == "< 30" } />Under by 30%</label>
                            <label><input type="radio" name="past_outperformance" value="< 40" readOnly checked={selected?.past_outperformance == "< 40" } />Under by 40%</label>
                            <label><input type="radio" name="past_outperformance" value="< 50" readOnly checked={selected?.past_outperformance == "< 50" } />Under by 50%</label>
                            <div>
                                <label><input type="radio" name="past_outperformance" value="custom" readOnly checked={selected?.past_outperformance?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Market Cap</h3>}
                        attr={"market_cap"}
                        callback={f.market_cap}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={100}
                        max={2000000}
                        options={
                        <>
                            <label><input type="radio" name="market_cap" value="[ 300 2000 ]" readOnly checked={selected?.market_cap == "[ 300 2000 ]"} />Small Cap ($300M - $2B)</label>
                            <label><input type="radio" name="market_cap" value="[ 2000 10000 ]" readOnly checked={selected?.market_cap == "[ 2000 10000 ]"} />Mid Cap ($2B - $10B)</label>
                            <label><input type="radio" name="market_cap" value="> 10000" readOnly checked={selected?.market_cap == "> 10000"} />Large Cap ($10B+)</label>
                            <label><input type="radio" name="market_cap" value="> 200000" readOnly checked={selected?.market_cap == "> 200000"} />Mega Cap ($200B+)</label>
                            <div>
                                <label><input type="radio" name="market_cap" value="custom" readOnly checked={selected?.market_cap?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
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
                            {sectors?.map((sector, index) => (<label key={index}><input type="radio" name="sector" value={sector} readOnly checked={selected?.sector == sector} />{sector}</label> ))}
                        </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Shares Outstanding</h3>}
                        attr={"shares_outstanding"}
                        callback={f.shares_outstanding}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={3}
                        max={20000}
                        options={
                        <>
                            <label><input type="radio" name="shares_outstanding" value="< 1000000" readOnly checked={selected?.shares_outstanding == "< 1000000"}/>Under 1M</label>
                            <label><input type="radio" name="shares_outstanding" value="< 5000000" readOnly checked={selected?.shares_outstanding == "< 5000000"}/>Under 5M</label>
                            <label><input type="radio" name="shares_outstanding" value="< 20000000" readOnly checked={selected?.shares_outstanding == "< 20000000"}/>Under 20M</label>
                            <label><input type="radio" name="shares_outstanding" value="< 50000000" readOnly checked={selected?.shares_outstanding == "< 50000000"}/>Under 50M</label>
                            <label><input type="radio" name="shares_outstanding" value="< 100000000" readOnly checked={selected?.shares_outstanding == "< 100000000"}/>Under 100M</label>
                            <label><input type="radio" name="shares_outstanding" value="> 1000000" readOnly checked={selected?.shares_outstanding == "> 1000000"}/>Over 1M</label>
                            <label><input type="radio" name="shares_outstanding" value="> 5000000" readOnly checked={selected?.shares_outstanding == "> 5000000"}/>Over 5M</label>
                            <label><input type="radio" name="shares_outstanding" value="> 20000000" readOnly checked={selected?.shares_outstanding == "> 20000000"}/>Over 20M</label>
                            <label><input type="radio" name="shares_outstanding" value="> 50000000" readOnly checked={selected?.shares_outstanding == "> 50000000"}/>Over 50M</label>
                            <label><input type="radio" name="shares_outstanding" value="> 100000000" readOnly checked={selected?.shares_outstanding == "> 100000000"}/>Over 100M</label>
                            <div>
                                <label><input type="radio" name="shares_outstanding" value="custom" readOnly checked={selected?.shares_outstanding?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Short Interest %</h3>}
                        attr={"short_interest"}
                        callback={f.short_interest}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={0}
                        max={50}
                        options={
                        <>
                            <label><input type="radio" name="short_interest" value="< 1" readOnly checked={selected?.short_interest == "< 1"} />Under 1%</label>
                            <label><input type="radio" name="short_interest" value="< 5" readOnly checked={selected?.short_interest == "< 5"} />Under 5%</label>
                            <label><input type="radio" name="short_interest" value="< 10" readOnly checked={selected?.short_interest == "< 10"} />Under 10%</label>
                            <label><input type="radio" name="short_interest" value="> 1" readOnly checked={selected?.short_interest == "> 1"} />Over 1%</label>
                            <label><input type="radio" name="short_interest" value="> 5" readOnly checked={selected?.short_interest == "> 5"} />Over 5%</label>
                            <label><input type="radio" name="short_interest" value="> 10" readOnly checked={selected?.short_interest == "> 10"} />Over 10%</label>
                            <label><input type="radio" name="short_interest" value="> 15" readOnly checked={selected?.short_interest == "> 15"} />Over 15%</label>
                            <label><input type="radio" name="short_interest" value="> 20" readOnly checked={selected?.short_interest == "> 20"} />Over 20%</label>
                            <div>
                                <label><input type="radio" name="short_interest" value="custom" readOnly checked={selected?.short_interest?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>}/>
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Analyst Ratings</h3>}
                        attr={"recommendation"}
                        callback={f.recommendation}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        options={
                        <>
                            <label><input type="radio" name="recommendation" value="buy" readOnly checked={selected?.recommendation == "buy"}/>Buy</label>
                            <label><input type="radio" name="recommendation" value="hold" readOnly checked={selected?.recommendation == "hold"}/>Hold</label>
                            <label><input type="radio" name="recommendation" value="sell" readOnly checked={selected?.recommendation == "sell"}/>Sell</label>
                            <label><input type="radio" name="recommendation" value="none" readOnly checked={selected?.recommendation == "none"}/>None</label>
                        </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Dividend Yield</h3>}
                        attr={"dividend_yield"}
                        callback={f.dividend_yield}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={0}
                        max={10}
                        options={
                        <>
                            <label><input type="radio" name="dividend_yield" value="0" readOnly checked={selected?.dividend_yield == "0"}/>None</label>
                            <label><input type="radio" name="dividend_yield" value="< 2" readOnly checked={selected?.dividend_yield == "< 2"}/>2% or Less</label>
                            <label><input type="radio" name="dividend_yield" value="> 2" readOnly checked={selected?.dividend_yield == "> 2"}/>Over 2%</label>
                            <label><input type="radio" name="dividend_yield" value="> 5" readOnly checked={selected?.dividend_yield == "> 5"}/>Over 5%</label>
                            <div>
                                <label><input type="radio" name="dividend_yield" value="custom" readOnly checked={selected?.dividend_yield?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Trailing PE Ratio</h3>}
                        attr={"trailing_pe"}
                        callback={f.trailing_pe}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={0}
                        max={100}
                        options={
                        <>
                            <label><input type="radio" name="trailing_pe" value="> 5" selected={selected?.trailing_pe == "> 5"} />More than 5</label>
                            <label><input type="radio" name="trailing_pe" value="> 15" selected={selected?.trailing_pe == "> 15"} />More than 15</label>
                            <label><input type="radio" name="trailing_pe" value="> 20" selected={selected?.trailing_pe == "> 20"} />More than 20</label>
                            <label><input type="radio" name="trailing_pe" value="> 50" selected={selected?.trailing_pe == "> 50"} />More than 50</label>
                            <label><input type="radio" name="trailing_pe" value="< 5" selected={selected?.trailing_pe == "< 5"} />Less than 5</label>
                            <label><input type="radio" name="trailing_pe" value="< 15" selected={selected?.trailing_pe == "< 15"} />Less than 15</label>
                            <label><input type="radio" name="trailing_pe" value="< 20" selected={selected?.trailing_pe == "< 20"} />Less than 20</label>
                            <label><input type="radio" name="trailing_pe" value="< 50" selected={selected?.trailing_pe == "< 50"} />Less than 50</label>
                            <div>
                                <label><input type="radio" name="trailing_pe" value="custom" readOnly checked={selected?.trailing_pe?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>} />
                        <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Forward PE Ratio</h3>}
                        attr={"forward_pe"}
                        callback={f.forward_pe}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={0}
                        max={100}
                        options={
                        <>
                            <label><input type="radio" name="forward_pe" value="> 5" selected={selected?.forward_pe == "> 5"} />More than 5</label>
                            <label><input type="radio" name="forward_pe" value="> 15" selected={selected?.forward_pe == "> 15"} />More than 15</label>
                            <label><input type="radio" name="forward_pe" value="> 20" selected={selected?.forward_pe == "> 20"} />More than 20</label>
                            <label><input type="radio" name="forward_pe" value="> 50" selected={selected?.forward_pe == "> 50"} />More than 50</label>
                            <label><input type="radio" name="forward_pe" value="< 5" selected={selected?.forward_pe == "< 5"} />Less than 5</label>
                            <label><input type="radio" name="forward_pe" value="< 15" selected={selected?.forward_pe == "< 15"} />Less than 15</label>
                            <label><input type="radio" name="forward_pe" value="< 20" selected={selected?.forward_pe == "< 20"} />Less than 20</label>
                            <label><input type="radio" name="forward_pe" value="< 50" selected={selected?.forward_pe == "< 50"} />Less than 50</label>
                            <div>
                                <label><input type="radio" name="forward_pe" value="custom" readOnly checked={selected?.forward_pe?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>} />
                    <FilterCard
                        allStocks={screenedStocks? screenedStocks : stocks}
                        title={<h3>Price to Book Ratio</h3>}
                        attr={"pb"}
                        callback={f.pb}
                        filters={filters}
                        setFilters={setFilters}
                        setSelected={setSelected}
                        selected={selected}
                        setAllStocks={setAllStocks}
                        min={1}
                        max={400}
                        options={<>
                            <label><input type="radio" name="pb" value="< 5" selected={selected?.pb == "< 5"}/>Less than 5</label>
                            <label><input type="radio" name="pb" value="> 5" selected={selected?.pb == "> 5"}/>More than 5</label>
                            <div>
                                <label><input type="radio" name="pb" value="custom" readOnly checked={selected?.pb?.startsWith("custom")}/>Custom Range</label>
                            </div>
                        </>} />
                </div>
                <div className="filter-actions">
                    <button onClick={() => clearFilters()}>Clear Filters</button>
                    <OpenModalButton
                        buttonText={"Create Screener"}
                        modalComponent={<CreateScreenerModal params={selected} />}/>
                </div>
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
                        {!allStocks?.length && <Loading />}
                    {allStocks?.map((stock) => (
                        <tr className="stock-card" onClick={() => navigate(`/stocks/${stock.ticker}`)} key={stock.ticker}>
                            <th scope="row">{stock.ticker}</th>
                            <td className="stock-name">{stock.name}</td>
                            <td className={stock?.past_day_return > 0 ? "win" : "lose"}>{(stock?.past_day_return * 100).toFixed(2)}%</td>
                            <td>{currencyFormat.format(stock.price)}</td>
                            <td>{stock?.avg_volume?.toLocaleString("en", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}</td>
                            <td>${stock?.market_cap?.toLocaleString("en", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })} M</td>
                            <td className={stock?.past_month_return > 0 ? "win" : "lose"}>{(stock?.past_month_return * 100).toFixed(2)}%</td>
                            <td className={stock?.past_year_return > 0 ? "win" : "lose"}>{(stock?.past_year_return * 100).toFixed(2)}%</td>
                            <td className={stock?.past_outperformance > 0 ? "win" : "lose"}>{(stock?.past_outperformance * 100).toFixed(2)}%</td>
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
