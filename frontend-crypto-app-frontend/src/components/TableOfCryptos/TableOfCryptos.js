import * as React from "react";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Avatar, Button } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
const ADD_COIN_URL = "/coins/add";
const RETRIEVE_COINS_URL = "/coins/coinsRetrieve";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const TableOfCryptos = (props) => {
  const { auth } = useAuth();
  const [coinsData, setCoinsData] = useState([]);

  const retrieveCoinsDataFromDB = async(filterWordStorage) => {
    try {
    const response = await axios(RETRIEVE_COINS_URL);
    response.data.coins.sort((a,b) => {return a.market_cap_rank-b.market_cap_rank });
    if(!!filterWordStorage && filterWordStorage.length > 0) 
    {
      setCoinsData(response.data.coins.filter(coin => coin.id.includes(filterWordStorage.toLowerCase())))
    } else {
      setCoinsData(response.data.coins);
    }
  } catch(err) {
    throw new Error(err);
  }
}

  // Fetch Data/Coins from the backend
  useEffect(() => {
    retrieveCoinsDataFromDB();
  }, []);

  useEffect(() => {
    //console.log(props.searchFilter);
  }, [props.searchFilter]);

  const addCoinToWatchlist = async (coinData) => {
    const { email } = auth;
    try {
      const response = await axios.post(
        ADD_COIN_URL,
        JSON.stringify({ email, coinData }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      JSON.stringify(response?.data);
      props.watchList(coinData);
    } catch (err) {
      throw new Error(err);
    }
  };
  // Format a current price from just a number to currency
  const formatPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  // Format just a number to a percentage and add coloring too?
  const formatPercent = (numToConvert) => {
    //let str = numToConvert.toFixed(2);
    const convertedNum = `${numToConvert.toFixed(2)}%`;
    if (numToConvert < 0) {
      return <div style={{ color: "#b90e0a" }}>{convertedNum}</div>;
    }
    return <div style={{ color: "#2e7d32" }}>{convertedNum}</div>;
  };
  
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Market Cap Rank</StyledTableCell>
            <StyledTableCell align="right">Coin</StyledTableCell>
            <StyledTableCell align="right">Price</StyledTableCell>
            <StyledTableCell align="right">1h</StyledTableCell>
            <StyledTableCell align="right">24h</StyledTableCell>
            <StyledTableCell align="right">7d</StyledTableCell>
            <StyledTableCell align="right">Volume</StyledTableCell>
            <StyledTableCell align="right">Mkt Cap</StyledTableCell>
            <StyledTableCell align="right">Watchlist</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coinsData.map((coin) => (
            <StyledTableRow key={coin.name}>
              <StyledTableCell align="center" component="th" scope="row">
                {coin.market_cap_rank}
                <Avatar alt="Crypto Mini Image" src={coin.image} />
              </StyledTableCell>
              <StyledTableCell align="right">{coin.name}</StyledTableCell>
              <StyledTableCell align="right">
                {formatPrice.format(coin.current_price)}
              </StyledTableCell>
              <StyledTableCell align="right">
                {formatPercent(
                  coin.price_change_1h
                )}
              </StyledTableCell>
              <StyledTableCell align="right">
                {formatPercent(
                  coin.price_change_24h
                )}
              </StyledTableCell>
              <StyledTableCell align="right">
                {formatPercent(
                  coin.price_change_7d
                )}
              </StyledTableCell>
              <StyledTableCell align="right">{`$${coin.volume.toLocaleString(
                "en-US"
              )}`}</StyledTableCell>
              <StyledTableCell align="right">{`$${coin.market_cap.toLocaleString(
                "en-US"
              )}`}</StyledTableCell>
              {/* Sent up props to define which crypto chart to show */}
              <StyledTableCell align="right">
                <Button
                  variant="contained"
                  onClick={() => {
                    addCoinToWatchlist({
                      name: coin.name,
                      image: coin.image,
                      price: formatPrice.format(coin.current_price),
                    });
                  }}
                >
                  Add To Watchlist
                </Button>
              </StyledTableCell>
              {/* <StyledTableCell align="right">{<MyChart coinName={coin.id} daysForChart="7" />}</StyledTableCell> */}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableOfCryptos;
