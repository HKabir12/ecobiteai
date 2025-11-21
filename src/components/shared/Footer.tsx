import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6">
        {/* Logo + Tagline */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-extrabold text-green-600">Eco</span>
            <span className="text-2xl font-extrabold text-gray-900">Bite</span>
          </div>
          <p className="text-gray-600 text-sm">
            Smart food management for a sustainable future. Track. Save.
            Nourish.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Navigate</h4>
          <ul className="space-y-2 text-gray-700">
            <li>
              <Link href="/" className="hover:text-green-600">
                Home
              </Link>
            </li>
            <li>
              <Link href="/inventory" className="hover:text-green-600">
                Inventory
              </Link>
            </li>
            <li>
              <Link href="/logs" className="hover:text-green-600">
                Food Logs
              </Link>
            </li>
            <li>
              <Link href="/resources" className="hover:text-green-600">
                Resources
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
          <p className="text-gray-700 text-sm">support@ecobite.app</p>
          <p className="text-gray-700 text-sm mt-1">
            Made for SDG 2 & SDG 12 Hackathon
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center py-4 border-t text-sm text-gray-600">
        © {new Date().getFullYear()} EcoBite — All rights reserved.
      </div>
    </footer>
  );
}
