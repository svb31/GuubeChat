from setuptools import setup

setup(
    name='chatboxserver',
    version='0.1',
    packages=['chatboxserver'],
    install_requires=['aiohttp'],
    entry_points={
        'console_scripts': [
            'chatboxserver = chatboxserver:main',
            ]
        },
    url='https://github.com/svb31/GuubeChat',
    )
