import React from 'react';

interface RowData {
    city: string;
    country: string;
    date: string;
    page: string;
    ip: string;
    region: string;
    timezone: string;
    userAgent: string;
    browser: string;
    os: string;
    device: string;
}

interface Props {
    data: RowData[];
}

const TableView: React.FC<Props> = ({ data }) => {
    return (
        <table>
            <thead>
            <tr>
                <th>Date</th>
                <th>Page</th>
                <th>IP</th>
                <th>City</th>
                <th>Country</th>
                <th>Region</th>
                <th>Timezone</th>
                <th>Browser</th>
                <th>OS</th>
                <th>Device</th>
            </tr>
            </thead>
            <tbody>
            {data.map((row, index) => (
                <tr key={index}>
                    <td>{row.date} (ADT)</td>
                    <td>{row.page}</td>
                    <td>{row.ip}</td>
                    <td>{row.city}</td>
                    <td>{row.country}</td>
                    <td>{row.region}</td>
                    <td>{row.timezone}</td>
                    <td>{row.browser}</td>
                    <td>{row.os}</td>
                    <td>{row.device}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default TableView;
