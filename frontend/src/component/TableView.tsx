import React from 'react';

interface RowData {
    city: string;
    country: string;
    date: string;
    ip: string;
    region: string;
    timezone: string;
    userAgent: string;
}

interface Props {
    data: RowData[];
}

const TableView: React.FC<Props> = ({ data }) => {
    return (
        <table>
            <thead>
            <tr>
                <th>City</th>
                <th>Country</th>
                <th>Date</th>
                <th>IP</th>
                <th>Region</th>
                <th>Timezone</th>
                <th>User Agent</th>
            </tr>
            </thead>
            <tbody>
            {data.map((row, index) => (
                <tr key={index}>
                    <td>{row.city}</td>
                    <td>{row.country}</td>
                    <td>{row.date}</td>
                    <td>{row.ip}</td>
                    <td>{row.region}</td>
                    <td>{row.timezone}</td>
                    <td>{row.userAgent}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default TableView;
