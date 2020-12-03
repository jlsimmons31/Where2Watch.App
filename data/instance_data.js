const instance_data = {
    my_list: [],
    add_to_list: (movie) => {
        if (instance_data.my_list.includes(movie))
            return false;
        instance_data.my_list.push(movie);
        return true;
    }
}

module.exports = { instance_data };