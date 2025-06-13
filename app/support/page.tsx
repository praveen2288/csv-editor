import React from 'react';

const SupportPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Support Snap Tools</h1>
      </header>

      <section className="mb-8">
        <p className="text-lg leading-relaxed">
          Snap Tools is a passion project, offering a collection of free utilities designed to make your life a little easier.
          As a solo developer, your support plays a crucial role in covering server costs, maintaining the existing tools,
          and fueling the development of new features and utilities.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How You Can Help</h2>
        <p className="mb-4 text-lg">
          If you find Snap Tools useful, please consider supporting its development. Every contribution, no matter the size, is greatly appreciated!
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Your GitHub Sponsors Link (Placeholder)
            </a>
          </li>
          <li>
            <a href="#" className="text-blue-600 hover:underline">
              Your Buy Me a Coffee Link (Placeholder)
            </a>
          </li>
        </ul>
      </section>

      <section className="text-center">
        <p className="text-md">
          Thank you for being a part of the Snap Tools community!
        </p>
      </section>
    </div>
  );
};

export default SupportPage;
