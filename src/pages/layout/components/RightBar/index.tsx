import { Favorite, PersonPin, PhonelinkLockOutlined } from "@mui/icons-material";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

const RightBar = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className="right">
            <Tabs value={value} onChange={handleChange} aria-label="icon tabs example" orientation="vertical"
                variant="fullWidth">
                <Tab icon={<PhonelinkLockOutlined />} aria-label="phone" />
                <Tab icon={<Favorite />} aria-label="favorite" />
                <Tab icon={<PersonPin />} aria-label="person" />
            </Tabs>
        </div>
    );

}

export default RightBar