import { FC, useState } from "react";
import { Button, TextField, Grid, Container } from '@mui/material';

type SearchFormProps = {
    onSearch: (name: string) => void
}

const SearchForm: FC<SearchFormProps> = ({ onSearch }) => {
    const [name, setName] = useState<string>('');

    const _onSearch = () => {
        onSearch(name);
    }

    const onChange = (event: any) => {
        setName(event.target.value);
    }

    return (
        <Container component="div" maxWidth="xl">
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        name="name"
                        fullWidth
                        type="text"
                        id="name"
                        label="Search With Name"
                        size="small"
                        value={name}
                        onChange={onChange}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={2}>
                    <Button
                        type="button"
                        onClick={_onSearch}
                        fullWidth
                        variant="contained"
                        color="secondary"
                        size="medium"
                    >
                        Search
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
};

export default SearchForm;