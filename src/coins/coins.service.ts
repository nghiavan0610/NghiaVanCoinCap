import { ConflictException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { CoinData } from './interfaces/coin.interface';

@Injectable()
export class CoinsService {
    async getAllCoins(page: number): Promise<CoinData[]> {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${page}&sparkline=false`;
        const response = await axios.get(`${url}`);

        const coins = response.data.map(
            ({ id, symbol, name, image, market_cap_rank, current_price, price_change_percentage_24h, market_cap }) => ({
                id,
                symbol,
                name,
                image,
                market_cap_rank,
                current_price,
                price_change_percentage_24h,
                market_cap,
            }),
        );

        return coins;
    }

    async getCoin(coinId: string): Promise<CoinData> {
        try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);

            const {
                id,
                symbol,
                name,
                image: { large },
                market_cap_rank,
                market_data: {
                    current_price: { usd },
                    price_change_percentage_24h,
                },
            } = response.data;

            const coin = {
                id,
                symbol,
                name,
                image: large,
                market_cap_rank,
                current_price: usd,
                price_change_percentage_24h,
            };
            return coin;
        } catch (err) {
            throw new ConflictException(`Error fetching real-time coin`);
        }
    }

    async getRealTimePrice(coinId: string): Promise<number> {
        try {
            const response = await axios.get(
                `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
            );
            return response.data[coinId].usd;
        } catch (err) {
            throw new ConflictException(`Error fetching real-time price`);
        }
    }
}
