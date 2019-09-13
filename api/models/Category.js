vendorCategories = [
	{shortTitle: 'venues', title: 'wedding venues'},
	{shortTitle: 'photographers', title: 'wedding photographers'},
	{shortTitle: 'makeup artists', title: 'bridal makeup artists'},
	{shortTitle: 'decorators', title: 'wedding decorators'},
	{shortTitle: 'mehndi artists', title: 'mehndi artists'},
	{shortTitle: 'choreographers', title: 'choreographers'},
	{shortTitle: 'invitations', title: 'wedding invitations'},
	{shortTitle: 'bridal designers', title: 'bridal designers'},
	{shortTitle: 'videographers', title: 'wedding videographers'},
	{shortTitle: 'planners', title: 'wedding planners'},
];

serviceCategories = [
    {title: 'candid photography', vendorCategories: ['photographers', 'videographers']},
    {title: 'traditional photography', vendorCategories: ['photographers', 'videographers']},
    {title: 'cinematic videography', vendorCategories: ['photographers', 'videographers']},
    {title: 'traditional videography', vendorCategories: ['photographers', 'videographers']},
    {title: 'photo album (40 pages)', vendorCategories: ['photographers', 'videographers']},
    {title: 'pre-wedding shoot', vendorCategories: ['photographers', 'videographers']},
    {title: 'bridal makeup', vendorCategories: ['makeup artists']},
    {title: 'guest makeup', vendorCategories: ['makeup artists']},
    {title: 'trial makeup', vendorCategories: ['makeup artists']},
    {title: 'can do makeup at', vendorCategories: ['makeup artists']},
    {title: 'airbrush bridal makeup', vendorCategories: ['makeup artists']},
    {title: 'per plate (veg)', vendorCategories: ['venues']},
    {title: 'min. charges per day (veg)', vendorCategories: ['venues']},
    {title: 'min. charges per day (non veg)', vendorCategories: ['venues']},
    {title: 'event areas', vendorCategories: ['venues']},
    {title: 'accomodation', vendorCategories: ['venues']},
    {title: 'other facilities', vendorCategories: ['venues']},
    {title: 'specializations', vendorCategories: ['choreographers', 'invitation', 'decorators']},
    {title: 'qualifications', vendorCategories: ['choreographers']},
    {title: 'unboxed cards', vendorCategories: ['invitation']},
    {title: 'boxed cards', vendorCategories: ['invitation']},
    {title: 'services provided', vendorCategories:['planner']},
    {title: 'in hourse services', vendorCategories:['planner']},
    {title: 'planning type', vendorCategories:['planner']},
	//{title: 'digital e-cards'},
    {title: 'bridal lehengas range', vendorCategories:['bridal designers']},
    {title: 'light lehengas range', vendorCategories:['bridal designers']},
    {title: 'gowns range', vendorCategories:['bridal designers']},
    {title: 'sarees range', vendorCategories:['bridal designers']},
    {title: 'indo-westerns range', vendorCategories:['bridal designers']},
    {title: 'anarkalis/suits range', vendorCategories:['bridal designers']},
    {title: 'food policy', vendorCategories: ['venues']},
    {title: 'decor policy', vendorCategories: ['venues']},
    {title: 'dj policy', vendorCategories: ['venues']},
    {title: 'alcohol policy', vendorCategories: ['venues']},
    {title: 'travel policy', vendorCategories: ['photographers', 'makeup artists', 'choreographers', 'videographers']},
    {title: 'payment policy', vendorCategories: ['photographers', 'makeup artists', 'venues', 
        'choreographers', 'invitation', 'mehndi artists', 'decorators', 'bridal designers', 'videographers']},
    {title: 'cancellation policy', vendorCategories: ['photographers', 'makeup artists', 'venues', 
        'choreographers', 'invitation', 'decorators', 'bridal designers']}
];

module.exports = {
    vendorCategories() {
        return vendorCategories;
    },

    serviceCategories() {
        return serviceCategories;
    },
}