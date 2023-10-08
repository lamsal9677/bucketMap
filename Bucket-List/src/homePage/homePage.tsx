import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MapPage from '../mapPage/mapPage'; // Update the import
import './homePage.css'

const activities = [
    {
        id: 1,
        name: 'Scuba Diving',
        href: '#',
        distance: '+10 mins',
        imageSrc: "src/assets/scuba_diving.jpg",
        imageAlt: 'Two women scuba diving.',
    },
    {
        id: 2,
        name: 'Horseback Riding',
        href: '#',
        distance: '+10 mins',
        imageSrc: "src/assets/horseback_riding.jpg",
        imageAlt: 'A man and a woman horseback riding.',
    },
    {
        id: 3,
        name: 'Skydiving',
        href: '#',
        distance: '+10 mins',
        imageSrc: "src/assets/skydiving.jpg",
        imageAlt: 'Two people skydiving.',
    },
    {
        id: 4,
        name: 'Helicopter Ride',
        href: '#',
        distance: '+10 mins',
        imageSrc: "src/assets/helicopter_ride.jpg",
        imageAlt: 'People in a moving helicopter in the air.',
    },
    {
        id: 5,
        name: 'Parasailing',
        href: '#',
        distance: '+10 mins',
        imageSrc: "src/assets/parasailing.jpg",
        imageAlt: 'A man and a woman parasailing while avoiding a shark.',
    },
    {
        id: 6,
        name: 'Ziplining',
        href: '#',
        distance: '+10 mins',
        imageSrc: "src/assets/ziplining.jpg",
        imageAlt: 'A man excited while ziplining.',
    },
    // More activities...
]

function HomePage() {
    return (
        <>
            <div className="bg-neutral-focus">
                <Link to="/mapPage" role="button" className="btn btn-accent text-black">Add your own</Link>
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Activities</h2>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {activities.map((activity) => (
                            <a key={activity.id} href={activity.href} className="group">
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                    <img
                                        src={activity.imageSrc}
                                        alt={activity.imageAlt}
                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm text-white-700">{activity.name}</h3>
                                <p className="mt-1 text-lg font-medium text-white-900">{activity.distance}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage