import { Search, Filter, Play } from 'lucide-react';
import { Navbar } from '../../shared/components/Navbar';
import { Button } from '../../shared/components/Button';

const COURSES = [
  {
    id: 1,
    title: 'Advanced AI Agents',
    instructor: 'Dr. Sarah Smith',
    category: 'Artificial Intelligence',
    duration: '12h 30m',
    students: '12.5k',
    price: '$89.00',
    image: 'https://picsum.photos/seed/ai/400/300',
  },
  {
    id: 2,
    title: 'Generative UI Design',
    instructor: 'Alex Rivera',
    category: 'Design',
    duration: '8h 15m',
    students: '8.2k',
    price: '$59.00',
    image: 'https://picsum.photos/seed/design/400/300',
  },
  {
    id: 3,
    title: 'Full Stack with Nexus',
    instructor: 'Michael Chen',
    category: 'Development',
    duration: '24h 45m',
    students: '25k',
    price: '$129.00',
    image: 'https://picsum.photos/seed/dev/400/300',
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Top Courses</h1>
            <p className="text-gray-500 mt-2">Browse our high-quality courses and start learning today.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="rounded-lg border-gray-200 pl-10 pr-4 text-sm focus:ring-indigo-600 focus:border-indigo-600"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((course) => (
            <div key={course.id} className="group overflow-hidden rounded-2xl bg-white border border-gray-200 flex flex-col transition-all hover:shadow-xl hover:border-indigo-200">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="size-12 rounded-full bg-white/90 flex items-center justify-center text-indigo-600 shadow-lg">
                    <Play className="size-6 fill-current" />
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                    {course.category}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">• {course.duration}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{course.instructor}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-lg font-bold text-gray-900">{course.price}</p>
                  <Button size="sm">Enroll Now</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
